
const Listing =require("../models/listing") 
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
    let newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;   //when user logins then it will store username .
    await newListing.save();
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
  res.render("listings/edit.ejs",{listing});
}
module.exports.updatelisting=async (req,res)=>{
    let {id} =req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
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