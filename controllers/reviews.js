const Listing =require("../models/listing");
const Review = require("../models/reviews.js");
module.exports.createReview =async (req, res) => {
    console.log(req.params.id)
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }
    const newReview = new Review(req.body.review);
    newReview.author =req.user._id;
    listing.reviews.push(newReview);
    
    await newReview.save();
    await listing.save();
    req.flash("success","New review Created!")
    res.redirect(`/listings/${listing._id}`);
}
module.exports.destroyReview=async (req, res) => {
    const { id, reviewId } = req.params;
    
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    
    const review = await Review.findById(reviewId).populate("author");
    if (!review) {
        req.flash("error", "Review not found");
        return res.redirect(`/listings/${id}`);
    }

    if (!review.author._id.equals(req.user._id)) {
        req.flash("error", "You don't have permission to delete this review");
        return res.redirect(`/listings/${id}`);
    }
    
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!")
    res.redirect(`/listings/${id}`);
}
