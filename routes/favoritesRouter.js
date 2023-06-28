const express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var authenticate = require('../authenticate');
const cors = require('./cors');

const Favorites = require('../models/favorites');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.find({user: req.user.id})
            .populate('user')
            .populate('dishes')
            .then((favorites) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);
            })
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
        Favorites.findOne({user: req.user.id})
            .lean()
            .then((userFavorites) => {
                if(!userFavorites){
                    userFavorites = new Favorites({user: req.user.id});
                }
                console.log(userFavorites);
                for(let i of req.body){
                    if(!userFavorites.dishes.find((d_id) => d_id.equals(i._id))){
                        userFavorites.dishes.push(i._id);
                    }
                    
                }
                Favorites.updateOne({user:req.user.id}, userFavorites, {upsert: true})
                    .then(() => {
                        console.log("Favorites Created");
                        res.statusCode = 200;
                        res.setHeader('Conetent-Type', 'application/json');
                        res.json(userFavorites);
                })
            })
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
        Favorites.remove({user: req.user.id})
            .populate('user')
            .populate('dishes.dish')
            .then((favs) => {
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(favs);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({user: req.user._id})
        .then((favorites) => {
            if(!favorites){
                res.statusCode = 200;
                res.setHeader('Content-Type', 'applicatio/json');
                return res.json({"exists":false, favorites});
            }
            else{
                if(favorites.dishes.indexOf(req.params.dishId) < 0){
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'applicatio/json');
                    return res.json({"exists":false, favorites});
                }
                else{
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'applicatio/json');
                    return res.json({"exists":true, favorites});
                }
            }
        })
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
        
    })

module.exports = favoriteRouter;

