const express = require("express");
const app = express();
// const cookieParser =require("cookie-parser");
// app.use(cookieParser("secretcode"));
const session = require("express-session");
const flash= require("connect-flash");
const path=require('path');
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");

//to get the data from the form
const sessionOptions={ 
    secret: "mysupersecretsession",
    resave: "false",
    saveUninitialized: true 
}
app.use(session(sessionOptions));
app.use(flash());
app.use((req,res,next)=>{
    res.locals.successMsg=req.flash("Success");
    res.locals.errorMsg=req.flash("error");
    next();
})

app.get("/register",(req,res)=>{
    let {name="Anonymous"}=req.query;
    // console.log(req.session);
    req.session.name=name;    //storing informarion
    console.log(req.session.name);
    if(name=="Anonymous"){
        req.flash("error","User not Registered")
    }
    else{
        req.flash("Success","User Registered successfully!")
    }
   res.redirect("/hello");
});
app.get("/hello",(req,res)=>{
    //console.log(req.flash("Success"))
   res.render("page.ejs",{name: req.session.name})  // using information 
})
// app.get("/reqcount",(req,res)=>{
//     if(req.session.count){
//         req.session.count++
//     }
//     else{
//         req.session.count=1;
//     }
//     res.send(`You sent a request ${req.session.count} times`)
// })

app.get("/test", (req, res) => {
    res.send("test Successful");
})

app.get("/getsignedcookie", (req, res) => {
    res.cookie("madein", "India", { signed: true });
    res.send("signed cookie sent")
})
app.get("/verify", (req, res) => {
    console.log(req.cookies)
    res.send("verified");

})

app.get("/getcookies", (req, res) => {
    res.cookie("greet", "namaste");
    res.cookie("madeIn", "India");
    res.send("sent You some Cookies");

})
app.listen(8080, () => {
    console.log("app is listening");

})

app.get("/", (req, res) => {
    console.dir(req.cookies);
    res.send("Hi iam Root");
});
