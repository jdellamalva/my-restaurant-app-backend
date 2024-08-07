const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Dish:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - description
 *         - imageUrl
 *         - restaurantId
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the dish
 *         name:
 *           type: string
 *           description: Name of the dish
 *         price:
 *           type: number
 *           description: Price of the dish
 *         description:
 *           type: string
 *           description: Description of the dish
 *         imageUrl:
 *           type: string
 *           description: Image URL of the dish
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date when the dish was created
 *         restaurantId:
 *           type: number
 *           description: ID of the restaurant this dish belongs to
 *       example:
 *         _id: 60d5f483fc13ae1e41000002
 *         name: Spaghetti Carbonara
 *         price: 12.99
 *         description: Classic Italian pasta dish with eggs, cheese, pancetta, and pepper.
 *         imageUrl: http://example.com/images/spaghetti-carbonara.jpg
 *         createdAt: 2021-06-25T14:48:00.000Z
 *         restaurantId: 1
 */

const dishSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    restaurantId: {
        type: Number,
        required: true,
    }
});

const Dish = mongoose.model('Dish', dishSchema);
module.exports = Dish;
