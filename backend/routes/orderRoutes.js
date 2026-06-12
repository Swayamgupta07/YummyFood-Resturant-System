const express = require('express');
const orderController = require('../controllers/orderController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);


router.route('/')
  .post(orderController.placeOrder)
  .get(restrictTo('ADMIN'), orderController.getAllOrders);

router.get('/my-orders', orderController.getMyOrders);
router.get('/dashboard-stats', restrictTo('ADMIN'), orderController.getDashboardStats);

router.route('/:id')
  .get(orderController.getOrderById);

router.patch('/:id/status', restrictTo('ADMIN'), orderController.updateOrderStatus);

module.exports = router;
