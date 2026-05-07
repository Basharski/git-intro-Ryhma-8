import express from 'express';
import {authenticateToken} from '../middlewares/authentication.js';
import * as KubiosController from '../controllers/kubios-data-controller.js';

const hrvEntryRouter = express.Router();

hrvEntryRouter.use(authenticateToken);

/**
 * @api {get} /api/hrv/data Hae kaikki HRV-tiedot
 * @apiDescription Hakee kirjautuneen käyttäjän kaikki tallennetut HRV-mittaukset aikajärjestyksessä.
 * @apiName GetHrvData
 * @apiGroup HRV
 * @apiHeader {String} Authorization Bearer-token.
 *
 * @apiSuccess {Object[]} measurements Lista HRV-mittauksista.
 * @apiSuccess {String} measurements.measure_id Uniikki mittaus-ID.
 * @apiSuccess {Number} measurements.rmssd Sykevälivaihtelun RMSSD-arvo.
 * @apiSuccess {Number} measurements.readiness Käyttäjän valmiustaso (0-100).
 */
hrvEntryRouter.get('/data', KubiosController.getMeasurementsByUserId);

/**
 * @api {get} /api/hrv/data/latest Hae uusin HRV-mittaus
 * @apiDescription Hakee käyttäjän kaikkein tuoreimman HRV-mittauksen tiedot.
 * @apiName GetLatestHrv
 * @apiGroup HRV
 * @apiHeader {String} Authorization Bearer-token.
 *
 * @apiSuccess {Object} measurement Tuoreimman mittauksen tiedot.
 * @apiError (404) NotFound Käyttäjällä ei ole vielä mittauksia.
 */
hrvEntryRouter.get('/data/latest', KubiosController.showLatestMeasurement);

/**
 * @api {post} /api/hrv/data/sync Synkronoi Kubios-data
 * @apiDescription Hakee uusimmat mittaukset Kubios Cloud API:sta, tallentaa ne paikalliseen tietokantaan ja palauttaa päivitetyn datan.
 * @apiName SyncHrvData
 * @apiGroup HRV
 * @apiHeader {String} Authorization Bearer-token.
 *
 * @apiSuccess {String} message Synkronoinnin tila.
 * @apiSuccess {Object[]} new_data Uusimmat synkronoidut mittaukset.
 * @apiError (500) InternalServerError Yhteys Kubios Cloudiin epäonnistui.
 */
hrvEntryRouter.post('/data/sync', KubiosController.syncAndReturn);

export default hrvEntryRouter;
