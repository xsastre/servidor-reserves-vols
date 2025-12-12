/**
 * Rutes de reserves (requereixen autenticació)
 */

const express = require('express');
const router = express.Router();
const { flights, bookings, getNextBookingId } = require('../data/data');
const { authenticateToken } = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     Booking:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID únic de la reserva
 *         userId:
 *           type: integer
 *           description: ID de l'usuari que ha fet la reserva
 *         flightId:
 *           type: integer
 *           description: ID del vol reservat
 *         flight:
 *           $ref: '#/components/schemas/Flight'
 *         passengers:
 *           type: integer
 *           description: Nombre de passatgers
 *         totalPrice:
 *           type: number
 *           description: Preu total de la reserva
 *         status:
 *           type: string
 *           enum: [confirmed, cancelled, pending]
 *           description: Estat de la reserva
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de creació
 *       example:
 *         id: 1
 *         userId: 1
 *         flightId: 1
 *         passengers: 2
 *         totalPrice: 179.98
 *         status: confirmed
 *         createdAt: "2024-05-20T10:30:00.000Z"
 *     CreateBookingRequest:
 *       type: object
 *       required:
 *         - flightId
 *         - passengers
 *       properties:
 *         flightId:
 *           type: integer
 *           description: ID del vol a reservar
 *         passengers:
 *           type: integer
 *           minimum: 1
 *           maximum: 9
 *           description: Nombre de passatgers (1-9)
 *       example:
 *         flightId: 1
 *         passengers: 2
 */

/**
 * @swagger
 * tags:
 *   name: Reserves
 *   description: Endpoints per gestionar reserves (requereixen autenticació)
 */

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Obtenir totes les reserves de l'usuari autenticat
 *     tags: [Reserves]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Llista de reserves de l'usuari
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 *       401:
 *         description: No autenticat
 */
router.get('/', authenticateToken, (req, res) => {
  const userBookings = bookings.filter(b => b.userId === req.user.id);
  
  // Afegir informació del vol a cada reserva
  const bookingsWithFlight = userBookings.map(booking => ({
    ...booking,
    flight: flights.find(f => f.id === booking.flightId)
  }));
  
  res.json(bookingsWithFlight);
});

/**
 * @swagger
 * /api/bookings/{id}:
 *   get:
 *     summary: Obtenir una reserva per ID
 *     tags: [Reserves]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la reserva
 *     responses:
 *       200:
 *         description: Detalls de la reserva
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       404:
 *         description: Reserva no trobada
 *       403:
 *         description: No tens permís per veure aquesta reserva
 */
router.get('/:id', authenticateToken, (req, res) => {
  const booking = bookings.find(b => b.id === parseInt(req.params.id));
  
  if (!booking) {
    return res.status(404).json({ error: 'Reserva no trobada' });
  }
  
  // Verificar que la reserva pertany a l'usuari
  if (booking.userId !== req.user.id) {
    return res.status(403).json({ error: 'No tens permís per veure aquesta reserva' });
  }
  
  // Afegir informació del vol
  const bookingWithFlight = {
    ...booking,
    flight: flights.find(f => f.id === booking.flightId)
  };
  
  res.json(bookingWithFlight);
});

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Crear una nova reserva
 *     tags: [Reserves]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBookingRequest'
 *     responses:
 *       201:
 *         description: Reserva creada correctament
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Dades invàlides
 *       404:
 *         description: Vol no trobat
 *       409:
 *         description: No hi ha prou seients disponibles
 */
router.post('/', authenticateToken, (req, res) => {
  const { flightId, passengers } = req.body;
  
  // Validacions
  if (!flightId || !passengers) {
    return res.status(400).json({ error: 'flightId i passengers són obligatoris' });
  }
  
  if (passengers < 1 || passengers > 9) {
    return res.status(400).json({ error: 'El nombre de passatgers ha de ser entre 1 i 9' });
  }
  
  // Buscar el vol
  const flight = flights.find(f => f.id === flightId);
  if (!flight) {
    return res.status(404).json({ error: 'Vol no trobat' });
  }
  
  // Verificar disponibilitat
  if (flight.availableSeats < passengers) {
    return res.status(409).json({ 
      error: 'No hi ha prou seients disponibles',
      availableSeats: flight.availableSeats
    });
  }
  
  // Calcular preu total
  const totalPrice = flight.price * passengers;
  
  // Crear reserva
  const newBooking = {
    id: getNextBookingId(),
    userId: req.user.id,
    flightId,
    passengers,
    totalPrice,
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };
  
  // Actualitzar seients disponibles
  flight.availableSeats -= passengers;
  
  // Guardar reserva
  bookings.push(newBooking);
  
  res.status(201).json({
    message: 'Reserva creada correctament',
    booking: {
      ...newBooking,
      flight
    }
  });
});

/**
 * @swagger
 * /api/bookings/{id}:
 *   put:
 *     summary: Modificar una reserva existent
 *     tags: [Reserves]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la reserva
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               passengers:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 9
 *     responses:
 *       200:
 *         description: Reserva modificada correctament
 *       400:
 *         description: Dades invàlides
 *       404:
 *         description: Reserva no trobada
 *       403:
 *         description: No tens permís per modificar aquesta reserva
 */
router.put('/:id', authenticateToken, (req, res) => {
  const bookingIndex = bookings.findIndex(b => b.id === parseInt(req.params.id));
  
  if (bookingIndex === -1) {
    return res.status(404).json({ error: 'Reserva no trobada' });
  }
  
  const booking = bookings[bookingIndex];
  
  // Verificar que la reserva pertany a l'usuari
  if (booking.userId !== req.user.id) {
    return res.status(403).json({ error: 'No tens permís per modificar aquesta reserva' });
  }
  
  // Verificar que la reserva no està cancel·lada
  if (booking.status === 'cancelled') {
    return res.status(400).json({ error: 'No es pot modificar una reserva cancel·lada' });
  }
  
  const { passengers } = req.body;
  
  if (passengers) {
    if (passengers < 1 || passengers > 9) {
      return res.status(400).json({ error: 'El nombre de passatgers ha de ser entre 1 i 9' });
    }
    
    const flight = flights.find(f => f.id === booking.flightId);
    const seatsDifference = passengers - booking.passengers;
    
    if (seatsDifference > 0 && flight.availableSeats < seatsDifference) {
      return res.status(409).json({ 
        error: 'No hi ha prou seients disponibles',
        availableSeats: flight.availableSeats + booking.passengers
      });
    }
    
    // Actualitzar seients
    flight.availableSeats -= seatsDifference;
    
    // Actualitzar reserva
    booking.passengers = passengers;
    booking.totalPrice = flight.price * passengers;
  }
  
  res.json({
    message: 'Reserva modificada correctament',
    booking: {
      ...booking,
      flight: flights.find(f => f.id === booking.flightId)
    }
  });
});

/**
 * @swagger
 * /api/bookings/{id}:
 *   delete:
 *     summary: Cancel·lar una reserva
 *     tags: [Reserves]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la reserva
 *     responses:
 *       200:
 *         description: Reserva cancel·lada correctament
 *       404:
 *         description: Reserva no trobada
 *       403:
 *         description: No tens permís per cancel·lar aquesta reserva
 *       400:
 *         description: La reserva ja està cancel·lada
 */
router.delete('/:id', authenticateToken, (req, res) => {
  const booking = bookings.find(b => b.id === parseInt(req.params.id));
  
  if (!booking) {
    return res.status(404).json({ error: 'Reserva no trobada' });
  }
  
  // Verificar que la reserva pertany a l'usuari
  if (booking.userId !== req.user.id) {
    return res.status(403).json({ error: 'No tens permís per cancel·lar aquesta reserva' });
  }
  
  // Verificar que la reserva no està ja cancel·lada
  if (booking.status === 'cancelled') {
    return res.status(400).json({ error: 'La reserva ja està cancel·lada' });
  }
  
  // Alliberar seients
  const flight = flights.find(f => f.id === booking.flightId);
  if (flight) {
    flight.availableSeats += booking.passengers;
  }
  
  // Marcar com cancel·lada
  booking.status = 'cancelled';
  
  res.json({
    message: 'Reserva cancel·lada correctament',
    booking
  });
});

module.exports = router;
