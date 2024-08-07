const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the user
 *         email:
 *           type: string
 *           description: The email of the user
 *         password:
 *           type: string
 *           description: The password of the user (hashed)
 *         googleId:
 *           type: string
 *           description: The Google ID of the user
 *         accessToken:
 *           type: string
 *           description: The access token for Google authentication
 *         refreshToken:
 *           type: string
 *           description: The refresh token for Google authentication
 *         provider:
 *           type: array
 *           items:
 *             type: string
 *           description: The provider(s) for user authentication (e.g., local, google)
 *           default: ['local']
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date when the user was created
 *         cart:
 *           type: array
 *           items:
 *             type: object
 *           description: The user's cart
 *       example:
 *         _id: "60c72b2f9b1d8e3a4c8e4b1d"
 *         email: "user@example.com"
 *         password: "$2b$10$wq1f8b./...hashedpassword"
 *         googleId: "1234567890"
 *         accessToken: "ya29.a0AfH6SMA..."
 *         refreshToken: "1//0gM..."
 *         provider: ["local"]
 *         createdAt: "2021-06-14T00:00:00.000Z"
 *         cart: []
 */

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        minlength: 6,
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true,
    },
    accessToken: {
        type: String,
    },
    refreshToken: {
        type: String,
    },
    provider: {
        type: [String],
        default: ['local'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    cart: {
        type: Array,
        default: [],
    }
}, {
    versionKey: '__v'
});

userSchema.pre('save', async function(next) {
    if (this.isModified('password') && this.password && !this.password.startsWith('$2b$')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

userSchema.methods.comparePassword = function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;