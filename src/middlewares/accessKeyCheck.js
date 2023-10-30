const mongoose = require("mongoose");
const AppError = require("../utils/AppError");
const DealerDetails = require("../models/dealerDetails");

module.exports = {
  accessKeyCheck: async (req, res, next) => {
    try {
      const accessKey = req.query.accessKey ?? req.body.accessKey;
      
      if(!accessKey) {
        throw new AppError(
          `Access Key is not provided in the query params!`,
          `Access Key is not provided. Please give in the query params for eg: /products?{accesskeyId} or /products/{productId}?{accesskeyId}`,
          401
        )
      }

      const checkDealer = await DealerDetails.findOne({ accessKey });

      if (!checkDealer) {
        throw new AppError(
          `Access Key: ${accessKey} is invalid`,
          `Invalid Access Key`,
          401
        );
      }

      req.body.dealerId = checkDealer?._id?.toString() 
      
      next();
    } catch (error) {
      next(error);
    }
  },
};
