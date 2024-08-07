const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

const loadEnvironmentVariables = () => {
    const env = process.env.NODE_ENV || 'development';
    const envFile = env === 'production' ? '.env.production' : '.env.local';
    const envPath = path.resolve(__dirname, envFile);

    if (fs.existsSync(envPath)) {
        dotenv.config({ path: envPath });
        console.log(`Loaded ${envFile} environment variables.`);
    } else {
        console.error(`Environment file ${envFile} not found. Please create it in the root directory.`);
        process.exit(1);
    }

    // Load common environment variables
    const commonEnvPath = path.resolve(__dirname, '.env');
    if (fs.existsSync(commonEnvPath)) {
        dotenv.config({ path: commonEnvPath });
        console.log('Loaded .env common environment variables.');
    } else {
        console.error('.env common environment file not found. Please create it in the root directory.');
        process.exit(1);
    }
};

module.exports = loadEnvironmentVariables;