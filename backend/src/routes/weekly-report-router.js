import express from 'express';
import {
  getUserReports,
  triggerReportGeneration,
  getLatestUserReport,
} from '../controllers/weekly-report-controller.js';
import {
  authenticateToken,
} from '../middlewares/authentication.js';

const reportRouter = express.Router();
reportRouter.use(authenticateToken);

/**
 * @api {get} /api/reports/user Hae käyttäjän raportit
 * @apiDescription Hakee kaikki kirjautuneen käyttäjän tai (ammattilaisen tapauksessa) asiakkaan viikkoraportit.
 * @apiName GetUserReports
 * @apiGroup Reports
 * @apiHeader {String} Authorization Bearer-token (JWT).
 *
 * @apiSuccess {Object[]} reports Lista viikkoraporteista.
 * @apiSuccess {Number} reports.id Raportin ID.
 * @apiSuccess {Number} reports.week_number Viikon numero.
 * @apiSuccess {Number} reports.year Vuosi.
 * @apiSuccess {Number} reports.avg_rmssd Viikon keskiarvo RMSSD:stä.
 */
reportRouter.get('/user', getUserReports);

/**
 * @api {get} /api/reports/latest Hae uusin raportti
 * @apiDescription Hakee käyttäjän tuoreimman valmiin viikkoraportin.
 * @apiName GetLatestReport
 * @apiGroup Reports
 * @apiHeader {String} Authorization Bearer-token (JWT).
 *
 * @apiSuccess {Object} report Tuorein raportti-objekti.
 * @apiError (404) NotFound Raportteja ei löytynyt.
 */
reportRouter.get('/latest', getLatestUserReport);

/**
 * @api {post} /api/reports/generate Luo raportit manuaalisesti
 * @apiDescription Käynnistää raporttien generointiprosessin. Tätä voidaan käyttää, jos automaattinen ajo ei ole vielä tapahtunut.
 * @apiName GenerateReports
 * @apiGroup Reports
 * @apiHeader {String} Authorization Bearer-token (JWT).
 *
 * @apiSuccess {String} message Onnistumisviesti (esim. "Reports generated successfully").
 */
reportRouter.post('/generate', triggerReportGeneration);

export default reportRouter;
