//1. Import express and mongoose and create an app
const express=require('express');
const app=express();
const mongoose=require('mongoose');
const path=require('path');
const methodOverride=require('method-override');
const ejsMate =require("ejs-mate");
const ExpressError =require("./utils/ExpressError.js")
const session=require("express-session");
const flash=require("connect-flash");
const passport= require("passport");
const Localstratagy= require("passport-local");
const User=require("./models/user.js");

const listingRouter=require("./Routes/listing.js");
const reviewsRouter = require('./Routes/review.js');
const userRouter = require('./Routes/user.js');

//setting the views folder
app.set("views",path.join(__dirname,"views"));
//setting the view engine
app.set("view engine","ejs");
//to get the data from the form

app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.engine("ejs", ejsMate);


app.use(express.static(path.join(__dirname,'public')));
app.listen(8080,()=>{
console.log("server started at 8080");
});

const sessionOptions = {
    secret: "superSecretCode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        httpOnly: true
    }
}
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localstratagy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
 
    next();
})

// app.get("/demouser",async(req,res)=>{
//     let fakeUser= new User({
//         email:"student@gmail.com",
//         username:"delta-student"

//     });
//     let registeredUser=await User.register(fakeUser,"helloworld");    //it automatically checks whether username is unique or not
//     res.send(registeredUser);

// })

//2. Create a route for root
app.get('/',(req,res)=>{
    res.redirect("/listings");
});


//3. Connecting to mongoDb
const MONGO_URL = process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/wanderlust";
async function main(){
    await mongoose.connect(MONGO_URL);
}
main()
.then(()=>{
    console.log("DB connection successful");
})
.catch((err)=>{
    console.log("DB connection failed",err);
});



//4. in data.js we have our data
//5. in listing.js we have our schema and model

//6. creating the route to test the listing model 
//when we visite the website the data will be saved in the database
// app.get("/testListing",async (req,res)=>{
//     let sampleListing = new Listing({
//         title:"my New Villa",
//         description: "by the beach ",
//         price:1200,
//         location:"Calangute,Goa",
//         country:"India",


//     });
//      await sampleListing.save();
//      console.log("Sample was Saved");
//      res.send("Successful Testing");
     

// });

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter)


//for all the other routes
app.all(/.*/,(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
});
//error handling middleware

app.use((err, req, res, next) => {
    const { status = 500, message = "Something Went Wrong" } = err;
    res.status(status).render("listings/error.ejs", { message: message });
});