
const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log the error stack for debugging
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode; // If status code is 200, it's a server error
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack, // Don't send stack in production
    });
};

module.exports = errorHandler;