const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => {
        console.log('mongo connection open')
    })
    .catch(() => {
        console.log('mongo connection error')
        console.log(err)
    })

//Cleans the campgrounds collection in the database and theen seeds it with
const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 50 + 15);
        const camp = new Campground({
            author: '641b1f73040dfc8dd77e483d',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${descriptors[Math.floor(Math.random() * descriptors.length)]} ${places[Math.floor(Math.random() * places.length)]}`,
            image: [
                {
                    url: 'https://res.cloudinary.com/dxmybobky/image/upload/v1679594916/Yelpcamp/qnfr6uciwl6zgzsw9c11.jpg',
                    filename: 'Yelpcamp/qnfr6uciwl6zgzsw9c11',
                },
                {
                    url: 'https://res.cloudinary.com/dxmybobky/image/upload/v1679594917/Yelpcamp/ixpakqvj3lang8oiovsc.jpg',
                    filename: 'Yelpcamp/ixpakqvj3lang8oiovsc',
                }
            ],
            description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Consequuntur, voluptate iste qui nemo odio ducimus quaerat ex in excepturi itaque. Minima ab quaerat aliquam odit voluptates perspiciatis quasi maxime vel!',
            price
        });
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})