// utils/cookie.js
const setCookie = (res, name, value) => {
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'None' : 'Lax', // Set 'None' only for production
        path: '/', // Set the path
    };

    res.cookie(name, value, cookieOptions);

    const setCookies = res.get('Set-Cookie');
    if (!setCookies || !setCookies.includes(`${name}=`)) {
        console.error(`Failed to set cookie ${name}`);
    }
};

const clearCookie = (res, name) => {
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'None' : 'Lax', // Set 'None' only for production
        path: '/',
        expires: new Date(0)
    };

    res.clearCookie(name, cookieOptions);

    const setCookies = res.get('Set-Cookie');
    if (!setCookies || !Array.isArray(setCookies) || !setCookies.some(cookie => cookie.includes(`${name}=;`))) {
        console.error(`Failed to clear cookie ${name}`);
    }
};

module.exports = { setCookie, clearCookie };