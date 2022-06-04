const mongoose = require('mongoose')
const cities = require('./cities')
const dayjs = require('dayjs')

const { places, descriptors } = require('./seedHelpers')
const Campground = require('../models/campground')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
  autoIndex: false,
})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error'))
db.once('open', () => {
  console.log('Database connected')
})

const sample = array => array[Math.trunc(Math.random() * array.length)]

const seedDB = async () => {
  await Campground.deleteMany({})
  for (let i = 0; i < 300; i++) {
    const random1000 = Math.trunc(Math.random() * 1000)
    const price = Math.trunc(Math.random() * 30) + 10
    const camp = new Campground({
      author: '6293479e5e15e4343b881077',
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      geometry: {
        type: 'Point',
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      images: [
        {
          url: 'https://res.cloudinary.com/dxpoec1l5/image/upload/v1654166660/YelpCamp/eimcelnc5erg7cumntaa.jpg',
          filename: 'YelpCamp/eimcelnc5erg7cumntaa',
        },
        {
          url: 'https://res.cloudinary.com/dxpoec1l5/image/upload/v1654166664/YelpCamp/zjwto9cjwyprb1xmds0w.jpg',
          filename: 'YelpCamp/zjwto9cjwyprb1xmds0w',
        },
      ],
      description:
        'Vexillologist literally flexitarian, locavore helvetica kale chips hell of edison bulb vice mixtape hashtag enamel pin tacos. Coloring book typewriter pinterest poutine. Cold-pressed tote bag locavore twee craft beer edison bulb quinoa freegan truffaut tacos kickstarter.',
      price,
      date: dayjs(),
    })
    await camp.save()
  }
}

seedDB().then(() => {
  mongoose.connection.close()
})
