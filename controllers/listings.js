
const Listing =require("../models/listing");
// took from gitcub link https://github.com/mapbox/mapbox-sdk-js
//this is for geocoding
//require the service
const mbxgeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken =process.env.MAP_TOKEN;
const geocodingClient = mbxgeocoding({ accessToken: mapToken });

module.exports.index=async (req,res)=>{
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
};

module.exports.rendernewform=(req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.showlisting =  async (req,res)=>{
    let {id} =req.params;
    const listing = await Listing.findById(id)
      .populate("reviews")
      .populate("owner")
      .populate({
        path: "reviews",
        populate: {
          path: "author"
        }
      });
    if(!listing){
      req.flash("error","Listing You Requested for does not exist!");
      return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}
module.exports.createlisting=async(req,res)=>{
    //normal method 
    //let {title,description,price,location,country} =req.body;
    // let listing= req.body.listing;
    // console.log(listing);
//mongoose method
//redirecting to the show page of that particular listing

let responce= await geocodingClient.forwardGeocode({
  query:req.body.listing.location ,
  limit: 1,
})
  .send()
  
let url=req.file.path;
let filename=req.file.filename;
console.log(url,"...",filename);

    let newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;   //when user logins then it will store username .
    //this is for the coordinates
    newListing.geometry=responce.body.features[0].geometry;
    let savedlisting=await newListing.save();
    console.log(savedlisting);
    req.flash("success","New Listing Created!")
    console.log("New Listing was Created");
    res.redirect("/listings"); 

}
module.exports.rendereditListing =async (req,res)=>{
    let {id} =req.params;
  const listing=  await Listing.findById(id);
  if(!listing){
    req.flash("error","Listing You Requested for does not exist!");
    return res.redirect("/listings");
  }
  let originalimageurl=listing.image.url;
  originalimageurl=originalimageurl.replace("/upload","/upload/h_300,w_250");
  res.render("listings/edit.ejs",{listing,originalimageurl});
}
module.exports.updatelisting=async (req,res)=>{
    let {id} =req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file!=="undefined"){
      let url=req.file.path;
      let filename=req.file.filename;
      listing.image={
        url,filename
      }

    }
   
    await listing.save();
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
}
module.exports.destroyListing=async (req,res)=>{
    let {id}=req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log("List deleted Successfully");
    console.log(deletedListing);
    req.flash("success","Listing Deleted!")
    res.redirect("/listings");
}