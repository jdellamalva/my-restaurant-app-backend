const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

const stripeKey = process.env.STRIPE_LIVE === 'true'
    ? process.env.STRIPE_SECRET_KEY_LIVE
    : process.env.STRIPE_SECRET_KEY_TEST;

const stripe = require('stripe')(stripeKey);

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management
 */

/**
 * @swagger
 * /api/v1/payment_intents:
 *   post:
 *     summary: Create a PaymentIntent
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: integer
 *                 description: Amount to be charged in cents
 *               currency:
 *                 type: string
 *                 description: Currency of the charge
 *               metadata:
 *                 type: object
 *                 description: Additional metadata for the payment
 *     responses:
 *       200:
 *         description: Successfully created PaymentIntent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 client_secret:
 *                   type: string
 *       500:
 *         description: Internal server error
 */
router.post('/payment_intents', async (req, res) => {
    try {
        const { amount, currency, metadata } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            automatic_payment_methods: {
                enabled: true,
            },
            metadata,
        });

        res.status(200).json({ client_secret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Error creating PaymentIntent:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/v1/orders:
 *   post:
 *     summary: Create an order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentIntentId:
 *                 type: string
 *                 description: The ID of the PaymentIntent
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     dish:
 *                       type: string
 *                       description: The ID of the dish
 *                     quantity:
 *                       type: integer
 *                       description: The quantity of the dish
 *               userId:
 *                 type: string
 *                 description: The ID of the user
 *     responses:
 *       201:
 *         description: Successfully created order
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Payment not successful
 *       500:
 *         description: Internal server error
 */
router.post('/orders', async (req, res) => {
    try {
        const { paymentIntentId, items, userId } = req.body;

        // Retrieve the PaymentIntent to confirm the payment
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status === 'succeeded') {
            // Create a new order
            const order = new Order({
                user: userId,
                paymentIntentId: paymentIntent.id,
                amount: paymentIntent.amount,
                currency: paymentIntent.currency,
                items,
                status: 'completed',
            });

            await order.save();

            res.status(201).json(order);
        } else {
            res.status(400).json({ error: 'Payment not successful' });
        }
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;