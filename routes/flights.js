/**
 * Rutes de vols
 */

const express = require('express');
const router = express.Router();
const { flights } = require('../data/data');
const { authenticateToken } = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     Flight:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID únic del vol
 *         flightNumber:
 *           type: string
 *           description: Número de vol
 *         origin:
 *           type: string
 *           description: Ciutat d'origen
 *         destination:
 *           type: string
 *           description: Ciutat de destí
 *         departureDate:
 *           type: string
 *           format: date
 *           description: Data de sortida
 *         departureTime:
 *           type: string
 *           description: Hora de sortida
 *         arrivalTime:
 *           type: string
 *           description: Hora d'arribada
 *         price:
 *           type: number
 *           description: Preu en euros
 *         availableSeats:
 *           type: integer
 *           description: Seients disponibles
 *         airline:
 *           type: string
 *           description: Companyia aèria
 *       example:
 *         id: 1
 *         flightNumber: VL001
 *         origin: Barcelona
 *         destination: Madrid
 *         departureDate: "2024-06-15"
 *         departureTime: "08:00"
 *         arrivalTime: "09:15"
 *         price: 89.99
 *         availableSeats: 120
 *         airline: Vueling
 */

/**
 * @swagger
 * tags:
 *   name: Vols
 *   description: Endpoints per consultar vols disponibles
 */

/**
 * @swagger
 * /api/flights:
 *   get:
 *     summary: Obtenir tots els vols disponibles
 *     tags: [Vols]
 *     parameters:
 *       - in: query
 *         name: origin
 *         schema:
 *           type: string
 *         description: Filtrar per ciutat d'origen
 *       - in: query
 *         name: destination
 *         schema:
 *           type: string
 *         description: Filtrar per ciutat de destí
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filtrar per data de sortida
 *     responses:
 *       200:
 *         description: Llista de vols
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Flight'
 */
router.get('/', (req, res) => {
  let result = [...flights];
  const { origin, destination, date } = req.query;

  if (origin) {
    result = result.filter(f => 
      f.origin.toLowerCase().includes(origin.toLowerCase())
    );
  }

  if (destination) {
    result = result.filter(f => 
      f.destination.toLowerCase().includes(destination.toLowerCase())
    );
  }

  if (date) {
    result = result.filter(f => f.departureDate === date);
  }

  res.json(result);
});

/**
 * @swagger
 * /api/flights/{id}:
 *   get:
 *     summary: Obtenir un vol per ID
 *     tags: [Vols]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del vol
 *     responses:
 *       200:
 *         description: Detalls del vol
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Flight'
 *       404:
 *         description: Vol no trobat
 */
router.get('/:id', (req, res) => {
  const flight = flights.find(f => f.id === parseInt(req.params.id));
  
  if (!flight) {
    return res.status(404).json({ error: 'Vol no trobat' });
  }

  res.json(flight);
});

/**
 * @swagger
 * /api/flights/search/destinations:
 *   get:
 *     summary: Obtenir totes les destinacions disponibles
 *     tags: [Vols]
 *     responses:
 *       200:
 *         description: Llista de destinacions úniques
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 */
router.get('/search/destinations', (req, res) => {
  const destinations = [...new Set(flights.map(f => f.destination))];
  res.json(destinations);
});

/**
 * @swagger
 * /api/flights/search/origins:
 *   get:
 *     summary: Obtenir tots els orígens disponibles
 *     tags: [Vols]
 *     responses:
 *       200:
 *         description: Llista d'orígens únics
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 */
router.get('/search/origins', (req, res) => {
  const origins = [...new Set(flights.map(f => f.origin))];
  res.json(origins);
});

module.exports = router;
