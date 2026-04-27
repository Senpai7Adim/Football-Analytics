const express = require('express');
const cors = require('cors');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const path = require('path');
const { fetchRealData } = require('./services/footballApiService');
const apiRoutes = require('./routes/api');

const app = express();
app.use(cors());
app.use(express.json());

let mongoServer;

const startServer = async () => {
  try {
    // Start Memory Server
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    // Connect to mongoose
    await mongoose.connect(mongoUri);
    console.log(`MongoDB successfully connected to memory server at ${mongoUri}`);

    // Fetch Real Data or Seed Mock Data
    await fetchRealData();

    // Register Routes
    app.use('/api', apiRoutes);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
  }
};

startServer();
