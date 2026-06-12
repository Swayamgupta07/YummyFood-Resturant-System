const Order = require('../models/Order');
const Food = require('../models/Food');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.placeOrder = catchAsync(async (req, res, next) => {
  const { items, paymentMethod, deliveryAddress, addressId } = req.body;

  if (!items || items.length === 0) {
    return next(new AppError('No items provided for the order', 400));
  }

  let finalAddress;
  if (addressId) {
    const user = await User.findById(req.user.id);
    const savedAddr = user.addresses.id(addressId);
    if (!savedAddr) {
      return next(new AppError('Saved address not found', 404));
    }
    finalAddress = {
      street: savedAddr.street,
      city: savedAddr.city,
      state: savedAddr.state,
      zipCode: savedAddr.zipCode,
      isDefault: savedAddr.isDefault
    };
  } else if (deliveryAddress) {
    finalAddress = deliveryAddress;
  } else {
    return next(new AppError('Please provide a delivery address or address ID', 400));
  }

  let totalAmount = 0;
  let hasPaidDelivery = false;
  const validatedItems = [];

  for (const item of items) {
    const foodItem = await Food.findById(item.food);
    if (!foodItem) {
      return next(new AppError(`Food item with ID ${item.food} not found`, 404));
    }
    if (!foodItem.active) {
      return next(new AppError(`Food item "${foodItem.name}" is currently unavailable`, 400));
    }

    const itemPrice = foodItem.price;
    const itemTotal = itemPrice * item.quantity;
    totalAmount += itemTotal;

    if (!foodItem.freeDelivery) {
      hasPaidDelivery = true;
    }

    validatedItems.push({
      food: foodItem._id,
      quantity: item.quantity,
      price: itemPrice
    });
  }

  if (hasPaidDelivery) {
    totalAmount += 50;
  }

  const order = await Order.create({
    user: req.user.id,
    items: validatedItems,
    totalAmount,
    deliveryAddress: finalAddress,
    paymentMethod,
    paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PAID',
    orderStatus: 'PLACED'
  });

  res.status(201).json({
    status: 'success',
    data: { order }
  });
});

exports.getMyOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id })
    .populate({
      path: 'items.food',
      select: 'name price imageUrl category'
    })
    .sort('-placedAt');

  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: { orders }
  });
});

exports.getOrderById = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate({
      path: 'items.food',
      select: 'name price imageUrl category'
    })
    .populate({
      path: 'user',
      select: 'name email phone'
    });

  if (!order) {
    return next(new AppError('No order found with that ID', 404));
  }

  if (order.user._id.toString() !== req.user.id && req.user.role !== 'ADMIN') {
    return next(new AppError('You do not have permission to view this order', 403));
  }

  res.status(200).json({
    status: 'success',
    data: { order }
  });
});

exports.getAllOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find()
    .populate({
      path: 'items.food',
      select: 'name price category'
    })
    .populate({
      path: 'user',
      select: 'name email phone'
    })
    .sort('-placedAt');

  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: { orders }
  });
});

exports.updateOrderStatus = catchAsync(async (req, res, next) => {
  const { orderStatus, paymentStatus } = req.body;

  const updateFields = {};
  if (orderStatus) updateFields.orderStatus = orderStatus;
  if (paymentStatus) {
    updateFields.paymentStatus = paymentStatus;
  } else if (orderStatus === 'DELIVERED') {
    updateFields.paymentStatus = 'PAID';
  }

  const order = await Order.findByIdAndUpdate(req.params.id, updateFields, {
    new: true,
    runValidators: true
  }).populate({
    path: 'items.food',
    select: 'name price category'
  });

  if (!order) {
    return next(new AppError('No order found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { order }
  });
});

exports.getDashboardStats = catchAsync(async (req, res, next) => {
  const totalOrders = await Order.countDocuments();

  const revenueData = await Order.aggregate([
    { $match: { paymentStatus: 'PAID' } },
    { $group: { _id: null, total: { $sum: '$totalAmount' } } }
  ]);
  const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

  const statusData = await Order.aggregate([
    { $group: { _id: '$orderStatus', count: { $sum: 1 } } }
  ]);
  const statusBreakdown = {};
  statusData.forEach(item => {
    statusBreakdown[item._id] = item.count;
  });

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const dailyStats = await Order.aggregate([
    { $match: { placedAt: { $gte: sevenDaysAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$placedAt' } },
        revenue: { $sum: '$totalAmount' },
        orders: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      totalOrders,
      totalRevenue,
      statusBreakdown,
      dailyStats
    }
  });
});
