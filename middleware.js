const Listing = require('./models/listing.js');
const {listingSchema,reviewSchema} =require("./schema.js");
const ExpressError =require("./utils/ExpressError.js");

//to check whether the user has loggined or not
module.exports.isLoggedIn=(req,res,next)=>{

    if(!req.isAuthenticated()){
        //redirectURL
        req.session.redirectUrl=req.originalUrl;
    req.flash("error","You Must be LoggedIn to create Listing!")
    return res.redirect("/login");
 }
next();
}

//when we make a new login then the passport resets the session values to null so 
//we store the originalurl in the locals
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

// middleware to give Access of edit and delete for only Specific users not all
module.exports.isOwner = async (req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    if (!listing.owner.equals(req.user._id)) {    //checks whether the CurrUser and Owner same or not
        req.flash("error", "You are not the Owner of this Listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

//Server  side validation of Schema using Joi
module.exports.validateListing = (req, res, next) => {
    // If multer parsed a file, attach its info to req.body.listing so Joi validation sees an image object
    if (req.file) {
        if (!req.body.listing) req.body.listing = {};
        req.body.listing.image = {
            url: req.file.path || req.file.location || "",
            filename: req.file.filename || ""
        };
    }
    const { error } = listingSchema.validate(req.body); 
    if (error) {
        const errMsg = error.details.map(el => el.message).join(','); 
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.validateReview  = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body); 
    if (error) {
        let errMsg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};