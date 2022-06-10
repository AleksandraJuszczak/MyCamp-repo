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
        const random1000 = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*20)+10;
        const camp = new Campground({
            author: '62a0719deb65c9e94418617d',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description:'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Adipisci labore est earum perferendis molestiae culpa dolores. Laboriosam at unde, voluptates possimus voluptatem totam culpa facere soluta sit rerum, eum nulla.',
            price,
            images:  [ 
            { "url" : "https://res.cloudinary.com/pointa/image/upload/v1654852464/YelpCamp/q02vdx1cdrcnsbvzs0qe.jpg", "filename" : "YelpCamp/q02vdx1cdrcnsbvzs0qe"}, 
            { "url" : "https://res.cloudinary.com/pointa/image/upload/v1654852464/YelpCamp/vr4ejosg55vc3lyifjjj.jpg", "filename" : "YelpCamp/vr4ejosg55vc3lyifjjj"} ]
        })
        await camp.save();
    }
    
}

seedDB().then(()=>{
    mongoose.connection.close()
})