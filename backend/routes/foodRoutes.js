const express = require('express');
const foodController = require('../controllers/foodController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

router.get('/', foodController.getAllFoods);
router.get('/:id', foodController.getFoodById);

router.post('/:id/reviews', protect, foodController.addReview);
router.use(protect, restrictTo('ADMIN'));

router.route('/')
  .post(upload.single('image'), foodController.createFood);

router.route('/:id')
  .patch(upload.single('image'), foodController.updateFood)
  .delete(foodController.deleteFood);

module.exports = router;
