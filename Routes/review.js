const express= require("express");
const router =express.Router({mergeParams:true});
const wrapAsync =require("../utils/wrapAsync.js");
const Review = require('../models/reviews.js');
const Listing = require('../models/listing.js');
const {isLoggedIn,validateReview}=require("../middleware.js")


const reviewController=require("../controllers/reviews.js")
//Reviws Route
//Post Review Route
router.post("/", isLoggedIn,validateReview, wrapAsync(reviewController.createReview));


//Delete Review Route
router.delete("/:reviewId", isLoggedIn, wrapAsync(reviewController.destroyReview));

module.exports= router;