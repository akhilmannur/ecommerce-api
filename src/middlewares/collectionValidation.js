const mongoose = require('mongoose');
const AppError = require('../utils/AppError');
const DealerDetails = require('../models/dealerDetails')
const switchDB = require('../services/switchDB')


module.exports = {
    collectionValidation: async (req, res, next) => {
        try {
            const apiKey = req.body.apiKey ?? req.user.apiKey
          
            await mongoose.connect(process.env.MONGODB_URL);
           
            const adminDb = mongoose.connection.db.admin();
            const databases = await adminDb.listDatabases();
            const databaseExists = databases.databases.find(db => db.name === `ecom-${apiKey}`);
            
            if(!databaseExists) {
                mongoose.connection.close();
                throw new AppError('Database does not exist with the API key provided', 'Invalid API Key', 404)
            }

            await mongoose.connection.close();
            await mongoose.connect(`${process.env.MONGODB_URL}/ecom-${apiKey}`)
        
            next()
          } catch (error) { 
            next(error)
          }
    }
} 