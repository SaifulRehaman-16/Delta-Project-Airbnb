const mongoose = require('mongoose');
const Schema =mongoose.Schema;
const Review = require('./reviews.js');
const User= require("./user.js");
// defining &create schema
const listingSchema = new Schema({
    title: String,
    description: String,
    price: Number,
    image: {
      filename: String,
  
      url: {
        type: String,
        default: "https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg?cs=srgb&dl=pexels-asadphoto-3155666.jpg&fm=jpg"
      }
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

