
const mongoose=require('mongoose');
const initData = require('./data.js');
const Listing=require('../models/listing.js');

const MONOGO_URL="mongodb://127.0.0.1:27017/wanderlust";
async function main(){
    await mongoose.connect(MONOGO_URL);
   
}
main()
.then(()=>{
    console.log("DB connection successful");
})
.catch((err)=>{
    console.log("DB connection failed",err);
});

// first we delete all the previous data and then we will add the new data
const initdb =async () =>{
    initData.data=initData.data.map((obj)=>({...obj, owner:"68f73f5db3ba3b31bb0ef97c"}))

    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log(" data was Initialized");
};
initdb();


