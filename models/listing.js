const mongoose = require('mongoose');
const Schema =mongoose.Schema;
const Review = require('./reviews.js');
const User= require("./user.js");
// defining &create schema
//blueprint
const listingSchema = new Schema({
    title: String,
    description: String,
    price: Number,
    image: {
      url:String,
      filename:String,
    },
    location: String,
    country: String,
    reviews:[
      {
        type: Schema.Types.ObjectId,
        ref:"Review"

      }
    ],
    owner:{
      type:Schema.Types.ObjectId,
      ref:"User",
    },
   geometry:{
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }


  });
  

listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await Review.deleteMany({_id:{$in:listing.reviews}})
  }
});

// creating the model and exporting
const Listing=mongoose.model('Listing',listingSchema);
module.exports=Listing;

