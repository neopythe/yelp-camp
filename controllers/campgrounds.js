const Campground = require('../models/campground')

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapboxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({ accessToken: mapboxToken })

const { cloudinary } = require('../cloudinary')

const catchAsync = require('../util/catchAsync')

module.exports.index = catchAsync(async (req, res) => {
  const campgrounds = await Campground.find({})
  res.render('campgrounds/index', { campgrounds })
})

module.exports.renderNewForm = (req, res) => {
  res.render('campgrounds/new')
}

module.exports.createCampground = catchAsync(async (req, res, next) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    })
    .send()
  const campground = new Campground(req.body.campground)
  campground.geometry = geoData.body.features[0].geometry
  campground.images = req.files.map(file => ({
    url: file.path,
    filename: file.filename,
  }))
  campground.author = req.user._id
  await campground.save()
  req.flash('success', 'Campground uploaded successfully')
  res.redirect(`/campgrounds/${campground._id}`)
})

module.exports.showCampground = catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id)
    .populate({
      path: 'reviews',
      populate: {
        path: 'author',
      },
    })
    .populate('author')
  if (!campground) {
    req.flash('error', 'Sorry, we were unable to find that campground')
    return res.redirect('/campgrounds')
  }
  res.render('campgrounds/show', { campground })
})

module.exports.renderEditForm = catchAsync(async (req, res) => {
  const { id } = req.params
  const campground = await Campground.findById(id)
  if (!campground) {
    req.flash('error', 'Sorry, we were unable to find that campground')
    return res.redirect('/campgrounds')
  }
  res.render('campgrounds/edit', { campground })
})

module.exports.updateCampground = catchAsync(async (req, res) => {
  const { id } = req.params
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  })
  const images = req.files.map(file => ({
    url: file.path,
    filename: file.filename,
  }))
  campground.images.push(...images)
  await campground.save()
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename)
    }
    await campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    })
  }
  req.flash('success', 'Campground updated successfully')
  res.redirect(`/campgrounds/${campground._id}`)
})

module.exports.deleteCampground = catchAsync(async (req, res) => {
  const { id } = req.params
  await Campground.findByIdAndDelete(id)
  req.flash('success', 'Campground deleted successfully')
  res.redirect('/campgrounds')
})
