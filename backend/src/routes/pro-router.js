import express from 'express';
import * as ProController from '../controllers/pro-controller.js';
import {
  authenticateToken,
  requireProfessional,
} from '../middlewares/authentication.js';

const proRouter = express.Router();

proRouter.use(authenticateToken);

/**
 * @api {post} /api/pro/generate-code Luo yhteyskoodi
 * @apiDescription Luo uuden 10-merkkisen yhteyskoodin, jonka ammattilainen voi antaa asiakkaalleen yhteyden muodostamiseksi.
 * @apiName GenerateCode
 * @apiGroup Professional
 * @apiPermission pro
 * @apiHeader {String} Authorization Bearer-token.
 *
 * @apiSuccess {String} code Luotu yhteyskoodi.
 * @apiSuccess {String} created_at Koodin luontiaika.
 */
proRouter.post(
  '/generate-code',
  requireProfessional,
  ProController.generateCode,
);

/**
 * @api {get} /api/pro/patients Hae asiakkaat
 * @apiDescription Hakee listan kaikista ammattilaiseen linkitetyistä asiakkaista.
 * @apiName GetPatients
 * @apiGroup Professional
 * @apiPermission pro
 * @apiHeader {String} Authorization Bearer-token.
 *
 * @apiSuccess {Object[]} patients Lista asiakkaista.
 * @apiSuccess {Number} patients.id Asiakkaan ID.
 * @apiSuccess {String} patients.name Asiakkaan nimi.
 * @apiSuccess {String} patients.email Asiakkaan sähköposti.
 */
proRouter.get('/patients', requireProfessional, ProController.getPatients);

/**
 * @api {get} /api/pro/patients/:patientId/reports Hae asiakkaan raportit
 * @apiDescription Hakee tietyn asiakkaan kaikki viikkoraportit.
 * @apiName GetPatientReports
 * @apiGroup Professional
 * @apiPermission pro
 * @apiHeader {String} Authorization Bearer-token.
 *
 * @apiParam {Number} patientId Asiakkaan (käyttäjän) ID.
 *
 * @apiSuccess {Object[]} reports Lista asiakkaan raportteista.
 */
proRouter.get(
  '/patients/:patientId/reports',
  requireProfessional,
  ProController.getPatientReports,
);

/**
 * @api {get} /api/pro/patients/:id/daily Hae asiakkaan päivälogit
 * @apiDescription Hakee tietyn asiakkaan päivittäiset merkinnät ja HRV-datan analyysia varten.
 * @apiName GetPatientDaily
 * @apiGroup Professional
 * @apiHeader {String} Authorization Bearer-token.
 *
 * @apiParam {Number} id Asiakkaan ID.
 *
 * @apiSuccess {Object[]} daily_logs Lista päivittäisistä mittauksista ja kirjauksista.
 */
proRouter.get('/patients/:id/daily', ProController.getPatientDailyLogs);

/**
 * @api {put} /api/pro/reports/feedback Anna palautetta raporttiin
 * @apiDescription Ammattilainen voi lisätä kommentteja tai ohjeita asiakkaan viikkoraporttiin.
 * @apiName AddFeedback
 * @apiGroup Professional
 * @apiPermission pro
 * @apiHeader {String} Authorization Bearer-token.
 *
 * @apiBody {Number} reportId Raportin ID, johon palaute lisätään.
 * @apiBody {String} feedback Ammattilaisen kirjoittama kommentti.
 *
 * @apiSuccess {String} message Palaute tallennettu onnistuneesti.
 */
proRouter.put(
  '/reports/feedback',
  requireProfessional,
  ProController.addFeedback,
);

export default proRouter;
