const rateLimit = require('express-rate-limit')

const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 Minutes in milliseconds
  max: 200,
  message: 'You have exceeded the number of API calls in 15 Minutes limit!', 
  standardHeaders: true,
  legacyHeaders: false,
  trustProxy: true
})

module.exports = rateLimiter
