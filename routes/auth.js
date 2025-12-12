/**
 * Rutes d'autenticació (registre i login)
 */

const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const { users } = require('../data/data');
const { generateToken, authenticateToken } = require('../middleware/auth');

let userIdCounter = 1;

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID únic de l'usuari
 *         name:
 *           type: string
 *           description: Nom complet de l'usuari
 *         email:
 *           type: string
 *           description: Email de l'usuari
 *       example:
 *         id: 1
 *         name: Joan Garcia
 *         email: joan@exemple.com
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           description: Nom complet
 *         email:
 *           type: string
 *           description: Email
 *         password:
 *           type: string
 *           description: Contrasenya (mínim 6 caràcters)
 *       example:
 *         name: Joan Garcia
 *         email: joan@exemple.com
 *         password: contrasenya123
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *       example:
 *         email: joan@exemple.com
 *         password: contrasenya123
 *     AuthResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         token:
 *           type: string
 *         user:
 *           $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 * tags:
 *   name: Autenticació
 *   description: Endpoints per gestionar l'autenticació
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar un nou usuari
 *     tags: [Autenticació]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Usuari registrat correctament
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Dades invàlides o email ja registrat
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validacions
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Tots els camps són obligatoris' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'La contrasenya ha de tenir mínim 6 caràcters' });
    }

    // Comprovar si l'email ja existeix
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'Aquest email ja està registrat' });
    }

    // Encriptar contrasenya
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuari
    const newUser = {
      id: userIdCounter++,
      name,
      email,
      password: hashedPassword
    };
    users.push(newUser);

    // Generar token
    const token = generateToken(newUser);

    res.status(201).json({
      message: 'Usuari registrat correctament',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error en el registre' });
  }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sessió
 *     tags: [Autenticació]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login correcte
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Credencials invàlides
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validacions
    if (!email || !password) {
      return res.status(400).json({ error: 'Email i contrasenya són obligatoris' });
    }

    // Buscar usuari
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Credencials invàlides' });
    }

    // Verificar contrasenya
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Credencials invàlides' });
    }

    // Generar token
    const token = generateToken(user);

    res.json({
      message: 'Login correcte',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error en el login' });
  }
});

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Obtenir el perfil de l'usuari actual
 *     tags: [Autenticació]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil de l'usuari
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: No autenticat
 */
router.get('/profile', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'Usuari no trobat' });
  }

  res.json({
    id: user.id,
    name: user.name,
    email: user.email
  });
});

module.exports = router;
