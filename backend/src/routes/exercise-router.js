import express from 'express';
import {getDailyRecommendations} from '../controllers/exercise-controller.js';
import {authenticateToken} from '../middlewares/auth-middleware.js';

const exerciseRouter = express.Router();

exerciseRouter.use(authenticateToken);

/**
 * @api {get} /api/exercises/recommendations Hae päivän harjoitussuositukset
 * @apiDescription Analysoi käyttäjän tuoreimman HRV-datan ja palauttaa sen perusteella sopivat harjoitukset (esim. lepoa, kevyttä huoltoa tai kovaa treeniä).
 * @apiName GetDailyRecommendations
 * @apiGroup Exercises
 * @apiHeader {String} Authorization Bearer-token.
 *
 * @apiSuccess {Object[]} recommendations Lista suositelluista harjoituksista.
 * @apiSuccess {String} recommendations.title Harjoituksen nimi.
 * @apiSuccess {String} recommendations.description Ohjeet harjoitukseen.
 * @apiSuccess {String} recommendations.category Harjoituskategoria (esim. "Palauttava").
 * @apiSuccess {Number} recommendations.intensity Harjoituksen intensiteetti (1-5).
 * * @apiError (404) NotFound Suosituksia ei voitu luoda (esim. puuttuvan HRV-datan vuoksi).
 */
exerciseRouter.get('/recommendations', getDailyRecommendations);

export default exerciseRouter;
