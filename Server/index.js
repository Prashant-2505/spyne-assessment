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

const clientURL = process.env.CLIENT_URL || 'http://localhost:5173';

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



// Deployment configuration
const __dirname1 = path.resolve();

if (process.env.NODE_ENV === 'production') {
  // Serve static files from the 'dist' directory
  app.use(express.static(path.join(__dirname1, 'client', 'dist')));

  // Handle all other routes by serving the index.html
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname1, 'client', 'dist', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json('API is running');
  });
}



// Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
