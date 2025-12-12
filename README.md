<img src="https://docencia.xaviersastre.cat/imatges/logosxs/logo_xaviersastre_v3_1.webp" alt="drawing" width="50%"/>

[![Desenvolupat amb Node.js](https://img.shields.io/badge/Desenvolupat%20amb-Node.js-339933?style=flat&logo=node.js&logoColor=white)](https://github.com/xsastre)
[![per en](https://img.shields.io/badge/per%20en-xsastre-red)](https://github.com/xsastre)
[![Desenvolupat al des-2025](https://img.shields.io/badge/Desenvolupat%20al-des--2025-yellow)](https://github.com/xsastre)

# Servidor de Reserves de Vols

API REST per gestionar reserves de vols amb autenticació JWT.

## Requisits

- Node.js (versió 16 o superior)
- npm

## Instal·lació

```bash
cd servidor-reserves-vols
npm install
```

## Execució

```bash
npm start
```

El servidor s'executarà a `http://localhost:3000`

## Documentació API

Un cop el servidor estigui en marxa, pots accedir a la documentació Swagger a:

**http://localhost:3000/api-docs**

## Endpoints disponibles

### Autenticació (`/api/auth`)

| Mètode | Endpoint | Descripció | Autenticació |
|--------|----------|------------|--------------|
| POST | `/api/auth/register` | Registrar un nou usuari | No |
| POST | `/api/auth/login` | Iniciar sessió | No |
| GET | `/api/auth/profile` | Obtenir perfil de l'usuari | Sí (JWT) |

### Vols (`/api/flights`)

| Mètode | Endpoint | Descripció | Autenticació |
|--------|----------|------------|--------------|
| GET | `/api/flights` | Obtenir tots els vols | No |
| GET | `/api/flights/:id` | Obtenir un vol per ID | No |
| GET | `/api/flights/search/destinations` | Obtenir destinacions disponibles | No |
| GET | `/api/flights/search/origins` | Obtenir orígens disponibles | No |

### Reserves (`/api/bookings`)

| Mètode | Endpoint | Descripció | Autenticació |
|--------|----------|------------|--------------|
| GET | `/api/bookings` | Obtenir reserves de l'usuari | Sí (JWT) |
| GET | `/api/bookings/:id` | Obtenir una reserva per ID | Sí (JWT) |
| POST | `/api/bookings` | Crear una nova reserva | Sí (JWT) |
| PUT | `/api/bookings/:id` | Modificar una reserva | Sí (JWT) |
| DELETE | `/api/bookings/:id` | Cancel·lar una reserva | Sí (JWT) |

## Autenticació JWT

Per accedir als endpoints protegits, cal incloure el token JWT a la capçalera `Authorization`:

```
Authorization: Bearer <token>
```

El token s'obté després de registrar-se o iniciar sessió.

## Exemple d'ús amb curl

### Registrar un usuari

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "Joan", "email": "joan@exemple.com", "password": "123456"}'
```

### Iniciar sessió

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "joan@exemple.com", "password": "123456"}'
```

### Obtenir vols

```bash
curl http://localhost:3000/api/flights
```

### Crear una reserva (amb autenticació)

```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"flightId": 1, "passengers": 2}'
```

---

Desenvolupat per en Xavier pels mòduls DWEC i DWES de DAW (des. 2025)
