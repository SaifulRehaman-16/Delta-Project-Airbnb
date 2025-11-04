const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require('../models/listing.js');
const path = require('path');
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const upload = require("../utils/cloudConfig.js");

// Index Route & Create route
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingController.createlisting)
    );

// New Route
router.get("/new", isLoggedIn, listingController.rendernewform);

// Show route
// Update Route
// Delete Route
router.route("/:id")
    .get(wrapAsync(listingController.showlisting))
    .put(isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updatelisting))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.rendereditListing));

module.exports = router;