const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - user
 *         - paymentIntentId
 *         - amount
 *         - currency
 *         - items
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the order
 *         user:
 *           type: string
 *           description: The user id associated with the order
 *         paymentIntentId:
 *           type: string
 *           description: The Stripe payment intent id
 *         amount:
 *           type: number
 *           description: The total amount of the order
 *         currency:
 *           type: string
 *           description: The currency of the order
 *         items:
 *           type: array
 *           items:
 *             type: object
 *           description: The items in the order
 *         status:
 *           type: string
 *           enum:
 *             - pending
 *             - completed
 *             - failed
 *           description: The status of the order
 *           default: pending
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date when the order was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date when the order was last updated
 *       example:
 *         _id: "60c72b2f9b1d8e3a4c8e4b1e"
 *         user: "60c72b2f9b1d8e3a4c8e4b1d"
 *         paymentIntentId: "pi_1F4Y8uH2RoI0yIbCl1n0wA6A"
 *         amount: 5000
 *         currency: "usd"
 *         items: [{ dishId: "60c72b2f9b1d8e3a4c8e4b1f", quantity: 2 }]
 *         status: "completed"
 *         createdAt: "2021-06-14T00:00:00.000Z"
 *         updatedAt: "2021-06-14T00:00:00.000Z"
 */

const OrderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    paymentIntentId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    items: { type: Array, required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' }
}, { timestamps: true });

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;