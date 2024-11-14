const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoute');
const carRoutes = require('./routes/carRoute');
const connectDB = require('./config/db');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const path = require('path');  // Add this to fix the 'path' reference

dotenv.config();
const app = express();

// Connect to the database
connectDB();

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Car Management API',
      version: '1.0.0',
      description: 'API documentation for the Car Management system',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./routes/*.js'], // Path to your API routes
};

// Initialize Swagger
const swaggerDocs = swaggerJsdoc(swaggerOptions)

// Middleware
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173"  // Allow requests only from this origin
}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));  // Serving static files from uploads

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', carRoutes);

// Swagger UI documentation route
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Start the server
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
