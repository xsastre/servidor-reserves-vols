/**
 * Servidor de Gestió de Reserves de Vols
 * API REST amb autenticació JWT
 */

const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const authRoutes = require('./routes/auth');
const flightsRoutes = require('./routes/flights');
const bookingsRoutes = require('./routes/bookings');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Reserves de Vols',
      version: '1.0.0',
      description: 'API REST per gestionar reserves de vols amb autenticació JWT',
      contact: {
        name: 'Suport API'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desenvolupament'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Introdueix el token JWT obtingut en el login'
        }
      }
    }
  },
  apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/flights', flightsRoutes);
app.use('/api/bookings', bookingsRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Benvingut a l\'API de Reserves de Vols',
    documentacio: '/api-docs',
    endpoints: {
      auth: '/api/auth',
      flights: '/api/flights',
      bookings: '/api/bookings'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error intern del servidor' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Servidor executant-se a http://localhost:${PORT}`);
  console.log(`Documentació Swagger disponible a http://localhost:${PORT}/api-docs`);
});
