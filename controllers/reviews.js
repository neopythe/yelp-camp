const Campground = require('../models/campground')
const Review = require('../models/review')

const catchAsync = require('../util/catchAsync')

module.exports.createReview = catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id)
  const review = new Review(req.body.review)
  review.author = req.user._id
  campground.reviews.unshift(review)
  await review.save()
  await campground.save()
  req.flash('success', 'Thank you for your review!')
  res.redirect(`/campgrounds/${campground._id}`)
})

module.exports.deleteReview = catchAsync(async (req, res) => {
  const { id, reviewId } = req.params
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
  await Review.findByIdAndDelete(reviewId)
  req.flash('success', 'Your review has been successfully deleted.')
  res.redirect(`/campgrounds/${id}`)
})
