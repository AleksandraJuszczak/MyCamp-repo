const mongoose = require('mongoose');
const review = require('./review');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
    
})
ImageSchema.virtual('thumbnail').get(function(){        //setting a virtual property with key of 'thumbnail'
    return this.url.replace('/upload','/upload/w_200') //the /w_200 is an option from Cloudinary to scale the width of the image to 200
})
const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

//a query middleware for findByIdAndDelete:
CampgroundSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema)