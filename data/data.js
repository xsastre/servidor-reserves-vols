/**
 * Dades d'exemple per al servidor
 * En una aplicació real, aquestes dades estarien en una base de dades
 */

// Usuaris registrats (contrasenya hasheada amb bcryptjs)
const users = [];

// Vols disponibles
const flights = [
  {
    id: 1,
    flightNumber: 'VL001',
    origin: 'Barcelona',
    destination: 'Madrid',
    departureDate: '2024-06-15',
    departureTime: '08:00',
    arrivalTime: '09:15',
    price: 89.99,
    availableSeats: 120,
    airline: 'Vueling'
  },
  {
    id: 2,
    flightNumber: 'IB234',
    origin: 'Barcelona',
    destination: 'París',
    departureDate: '2024-06-15',
    departureTime: '10:30',
    arrivalTime: '12:45',
    price: 149.99,
    availableSeats: 85,
    airline: 'Iberia'
  },
  {
    id: 3,
    flightNumber: 'RY456',
    origin: 'Barcelona',
    destination: 'Londres',
    departureDate: '2024-06-16',
    departureTime: '14:00',
    arrivalTime: '15:30',
    price: 79.99,
    availableSeats: 150,
    airline: 'Ryanair'
  },
  {
    id: 4,
    flightNumber: 'VL002',
    origin: 'Madrid',
    destination: 'Barcelona',
    departureDate: '2024-06-17',
    departureTime: '18:00',
    arrivalTime: '19:15',
    price: 95.99,
    availableSeats: 100,
    airline: 'Vueling'
  },
  {
    id: 5,
    flightNumber: 'IB789',
    origin: 'Barcelona',
    destination: 'Roma',
    departureDate: '2024-06-18',
    departureTime: '07:00',
    arrivalTime: '09:00',
    price: 129.99,
    availableSeats: 90,
    airline: 'Iberia'
  },
  {
    id: 6,
    flightNumber: 'AF123',
    origin: 'Barcelona',
    destination: 'Amsterdam',
    departureDate: '2024-06-19',
    departureTime: '11:00',
    arrivalTime: '14:00',
    price: 169.99,
    availableSeats: 75,
    airline: 'Air France'
  }
];

// Reserves
const bookings = [];
let bookingIdCounter = 1;

module.exports = {
  users,
  flights,
  bookings,
  getNextBookingId: () => bookingIdCounter++
};
