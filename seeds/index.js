const mongoose = require('mongoose');
const cities=require('./cities');
const{places, descriptors} = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp')


// bind() lets you create a new function with its this value set to a provided value
// Because browser implementations require that console.error()’s this value be set to
//  the console object, the call to bind() generates a new function that does just that.
const db=mongoose.connection;
db.on("error", console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Database connected");
})

const sample = array=> array[Math.floor(Math.random()*array.length)];

const seedDB = async() => {
    await Campground.deleteMany({});
    for(let i=0;i<50;i++){
        const random1000 = Math.floor(Math.random()*1000)
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        })
        await camp.save();
    }
    
}

seedDB().then(()=>{
    mongoose.connection.close()
})