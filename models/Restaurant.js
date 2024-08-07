const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

/**
 * @swagger
 * components:
 *   schemas:
 *     Restaurant:
 *       type: object
 *       required:
 *         - name
 *         - imageUrl
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the restaurant
 *         name:
 *           type: string
 *           description: Name of the restaurant
 *         imageUrl:
 *           type: string
 *           description: Image URL of the restaurant
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date when the restaurant was created
 *         dishes:
 *           type: array
 *           items:
 *             type: string
 *             description: ObjectId of the dish
 *         restaurantId:
 *           type: integer
 *           description: Auto-incremented ID of the restaurant
 *       example:
 *         _id: 60d5f483fc13ae1e41000001
 *         name: Pasta Palace
 *         imageUrl: http://example.com/images/pasta-palace.jpg
 *         createdAt: 2021-06-25T14:48:00.000Z
 *         dishes:
 *           - 60d5f483fc13ae1e41000002
 *           - 60d5f483fc13ae1e41000003
 *         restaurantId: 1
 */

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  dishes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dish'
  }]
});

restaurantSchema.plugin(AutoIncrement, { inc_field: 'restaurantId' });

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;
