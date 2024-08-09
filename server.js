const loadEnvironmentVariables = require('./envLoader');
loadEnvironmentVariables();

const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('./config/passport');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
const cors = require('cors');
const helmet = require('helmet');
const connectToMongoDB = require('./config/mongo');

const { logger } = require('./middleware');
const userRoutes = require('./routes/userRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const port = process.env.PORT || 3001;

// Ensure CORS is applied before any other middleware
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Handle preflight requests
app.options('*', cors());

app.use(cookieParser());
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
        secure: process.env.NODE_ENV === 'production',
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(logger);

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'", "https://js.stripe.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://js.stripe.com"],
            connectSrc: [
                "'self'",
                "https://api.stripe.com",
                "https://q.stripe.com",
                "https://checkout.stripe.com",
                "https://hooks.stripe.com",
                "https://merchant-ui-api.stripe.com",
                "https://errors.stripe.com",
                "https://r.stripe.com",
                "https://ppm.stripe.com",
                "https://*.stripe.com"
            ],
            frameSrc: ["'self'", "https://js.stripe.com", "https://hooks.stripe.com", "https://checkout.stripe.com"],
            imgSrc: ["'self'", "https://*.stripe.com"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            reportUri: '/csp-violation-report-endpoint'
        },
        reportOnly: false
    }
}));

// Routes
app.get('/', (req, res) => {
    res.send(
        `<strong>Giovanni's Pizza Collective</strong><br>by jdellamalva<br><br>API Documentation available <a href="/api/v1/docs">here</a>.`
    );
});

// Serve Swagger JSON directly at /api/v1/swagger.json
app.use('/api/v1/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpecs);
});

// Serve Swagger UI at /api/v1/docs
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// API Routes
app.use('/api/v1', userRoutes);
app.use('/api/v1', paymentRoutes);
app.use('/api/v1', restaurantRoutes);
app.use('/api/v1', authRoutes);

// Connect to MongoDB
connectToMongoDB();

// Setup a listener
app.listen(port, () => {
    console.log(`${process.env.NODE_ENV} server running on port ${port}`);
});