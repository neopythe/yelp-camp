const express = require('express')
const router = express.Router({ mergeParams: true })

const reviews = require('../controllers/reviews')

const { isLoggedIn, isReviewAuthor, validateReview } = require('../middleware')

router.post('/', isLoggedIn, validateReview, reviews.createReview)

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, reviews.deleteReview)

module.exports = router
