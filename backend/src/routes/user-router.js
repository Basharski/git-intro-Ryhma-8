import express from 'express';
import {authenticateToken} from '../middlewares/authentication.js';
import {postLogin} from '../controllers/kubios-auth-controller.js';
import * as UserController from '../controllers/user-controller.js';

const userRouter = express.Router();

/**
 * @api {post} /api/user/login Kirjautuminen
 * @apiDescription Kirjautuu sisään järjestelmään ja synkronoi tiedot Kubios Cloudin kanssa.
 * @apiName PostLogin
 * @apiGroup User
 *
 * @apiBody {String} email Käyttäjän sähköposti.
 * @apiBody {String} password Käyttäjän salasana.
 *
 * @apiSuccess {String} token JWT-autentikointitoken.
 * @apiSuccess {Object} user Käyttäjän perustiedot.
 * @apiError (401) Unauthorized Kirjautuminen epäonnistui (väärät tunnukset).
 */
userRouter.post('/login', postLogin);

userRouter.use(authenticateToken);

/**
 * @api {get} /api/user/profile Hae profiili
 * @apiDescription Hakee kirjautuneen käyttäjän kaikki tiedot (mukaan lukien pituus, paino jne.).
 * @apiName GetProfile
 * @apiGroup User
 * @apiHeader {String} Authorization Bearer-token.
 *
 * @apiSuccess {Object} profile Käyttäjän profiilitiedot.
 */
userRouter.get('/profile', UserController.getUserDataById);

/**
 * @api {patch} /api/user/profile Päivitä profiili
 * @apiDescription Päivittää kirjautuneen käyttäjän tietoja (esim. pituus tai paino).
 * @apiName PatchProfile
 * @apiGroup User
 * @apiHeader {String} Authorization Bearer-token.
 *
 * @apiBody {String} [name] Käyttäjän nimi.
 * @apiBody {Number} [height] Pituus (cm).
 * @apiBody {Number} [weight] Paino (kg).
 *
 * @apiSuccess {String} message Päivitys onnistui.
 */
userRouter.patch('/profile', UserController.updateUserProfile);

/**
 * @api {post} /api/user/patient/claim-code Käytä yhteyskoodi
 * @apiDescription Käyttäjä syöttää ammattilaiselta saadun koodin, joka linkittää heidät toisiinsa.
 * @apiName ClaimCode
 * @apiGroup User
 * @apiHeader {String} Authorization Bearer-token.
 *
 * @apiBody {String} code 6-merkkinen yhteyskoodi.
 *
 * @apiSuccess {String} message Koodi hyväksytty ja yhteys luotu.
 * @apiError (400) BadRequest Koodi on virheellinen tai vanhentunut.
 */
userRouter.post('/patient/claim-code', UserController.claimCode);

/**
 * @api {put} /api/user/patient/permissions Päivitä käyttöoikeudet
 * @apiDescription Muokkaa, mitä tietoja ammattilainen voi nähdä (permissions JSON).
 * @apiName UpdatePermissions
 * @apiGroup User
 * @apiHeader {String} Authorization Bearer-token.
 *
 * @apiBody {Object} permissions JSON-objekti oikeuksista.
 *
 * @apiSuccess {String} message Oikeudet päivitetty.
 */
userRouter.put(
  '/patient/permissions',
  UserController.updateShareDataPermissions,
);

/**
 * @api {delete} /api/user/delete Poista tili
 * @apiDescription Poistaa kirjautuneen käyttäjän tilin ja kaiken siihen liittyvän datan pysyvästi.
 * @apiName DeleteUser
 * @apiGroup User
 * @apiHeader {String} Authorization Bearer-token.
 *
 * @apiSuccess {String} message Tili poistettu.
 */
userRouter.delete('/delete', UserController.deleteUser);

/**
 * @api {delete} /api/user/patient/revoke Katkaise yhteys
 * @apiDescription Katkaisee yhteyden ammattilaiseen, jolloin ammattilainen ei enää näe käyttäjän dataa.
 * @apiName RevokeAccess
 * @apiGroup User
 * @apiHeader {String} Authorization Bearer-token.
 *
 * @apiSuccess {String} message Yhteys katkaistu.
 */
userRouter.delete('/patient/revoke', UserController.revokeAccess);

export default userRouter;
