import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import userRouter from './routes/user-router.js';
import requestLogger from './middlewares/logger.js';
import {errorHandler, notFoundHandler} from './middlewares/error-handlers.js';
import entryRouter from './routes/hrv-router.js';
const hostname = '127.0.0.1';
const app = express();
const port = 8000;

// enable CORS requests
app.use(cors());

// parsitaan json data pyynnöstä ja lisätään request-objektiin
app.use(express.json());
// tarjoillaan webbisivusto (front-end) palvelimen juuressa
app.use('/', express.static('public'));
// Oma loggeri middleware, käytössä koko sovelluksen laajuisesti eli käsittee kaikki http-pyynnöt
app.use(requestLogger);

// API root
app.get('/api', (req, res) => {
  res.send('Teacher example Health Diary API!');
});

// Users resource router for all /api/users routes
app.use('/api/users', userRouter);

// Entries router
app.use('/api/hrv', entryRouter);

// jos pyyntö ei "mätsää" minkään ylläolevan reitin kanssa, kyseessä on 404-tilanne
app.use(notFoundHandler);
// virheenkäsittelijälle ohjataa kaikki pyynnöt, jossa mukana on error objekti
app.use(errorHandler);

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
