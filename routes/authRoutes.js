const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { setCookie, clearCookie } = require('../utils/cookie');
const { auth } = require('../middleware');
const User = require('../models/User');

const FRONTEND_URL = process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL_PROD : process.env.FRONTEND_URL_DEV;

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication management
 */

/**
 * @swagger
 * /api/v1/auth/google:
 *   get:
 *     summary: Authenticate with Google
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirects to Google for authentication
 */
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

/**
 * @swagger
 * /api/v1/auth/google/callback:
 *   get:
 *     summary: Google authentication callback
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirects to frontend URL on successful authentication
 *       401:
 *         description: Authentication failed, redirects to login
 */
router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    setCookie(res, 'token', token);

    res.redirect(`${FRONTEND_URL}/`);
  }
);

/**
 * @swagger
 * /api/v1/auth/logout:
 *   get:
 *     summary: Logout the user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successfully logged out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Logout success message
 *       500:
 *         description: Server error
 */
router.get('/auth/logout', (req, res, next) => {
  const clearCookies = () => {
    clearCookie(res, 'connect.sid');
    clearCookie(res, 'token');
    res.json({ message: 'Logged out successfully' });
  };

  if (req.session) {
    req.logout((err) => {
      if (err) {
        console.error('Logout error:', err);
        return next(err);
      }

      req.session.destroy((err) => {
        if (err) {
          console.error('Session destruction error:', err);
          return next(err);
        }
        clearCookies();
      });
    });
  } else {
    clearCookies();
  }
});

/**
 * @swagger
 * /api/v1/auth/check:
 *   get:
 *     summary: Check if user is authenticated
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User is authenticated
 *       401:
 *         description: User is not authenticated
 */
router.get('/auth/check', auth, (req, res) => {
  res.status(200).json({ message: 'Authenticated', user: req.user });
});

module.exports = router;
