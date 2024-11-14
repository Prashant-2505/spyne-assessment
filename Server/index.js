const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoute');
const carRoutes = require('./routes/carRoute');
const connectDB = require('./config/db');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const path = require('path'); // Added for path operations

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

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Middleware
app.use(express.json());

const clientURL = ['https://spyne-assessment-3.onrender.com','https://spyne-assessment.vercel.app/'];

// Apply CORS middleware conditionally
app.use(
  cors({
    origin: clientURL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

// Serving static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', carRoutes);

// Swagger UI documentation route
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));





// Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
