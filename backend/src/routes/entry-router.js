import express from 'express';
import {authenticateToken} from '../middlewares/authentication.js';
import * as EntryController from '../controllers/entry-controller.js';

const entryRouter = express.Router();

entryRouter.use(authenticateToken)

/**
 * @api {get} /api/entries Hae omat kirjaukset
 * @apiDescription Hakee kaikki kirjautuneen käyttäjän tekemät päivittäiset merkinnät (teksti, kuormitus ja fiilis).
 * @apiName GetEntries
 * @apiGroup Entries
 * @apiHeader {String} Authorization Bearer-token.
 *
 * @apiSuccess {Object[]} entries Lista käyttäjän kirjauksista.
 * @apiSuccess {Number} entries.id Merkinnän ID.
 * @apiSuccess {String} entries.user_text Käyttäjän kirjoittama päiväkirjamerkintä.
 * @apiSuccess {Number} entries.workload Työkuormitus (arvoina esim. 1-5).
 * @apiSuccess {Number} entries.mood_score Fiilisarvosana (1-5).
 */
entryRouter.get('/', EntryController.showUserEntries);

/**
 * @api {post} /api/entries Luo uusi kirjaus
 * @apiDescription Tallentaa uuden päivittäisen merkinnän.
 * @apiName PostEntry
 * @apiGroup Entries
 * @apiHeader {String} Authorization Bearer-token.
 *
 * @apiBody {String} user_text Päivän fiilikset ja huomiot tekstinä.
 * @apiBody {Number} [workload] Päivän työkuormitus.
 * @apiBody {Number} [mood_score] Päivän fiilis (1-5).
 *
 * @apiSuccess {String} message Kirjaus tallennettu onnistuneesti.
 */
entryRouter.post('/', EntryController.postUserEntry);

/**
 * @api {patch} /api/entries/:id Muokkaa kirjausta
 * @apiDescription Päivittää aiemmin luodun merkinnän sisältöä.
 * @apiName PatchEntry
 * @apiGroup Entries
 * @apiHeader {String} Authorization Bearer-token.
 *
 * @apiParam {Number} id Muokattavan merkinnän ID.
 * @apiBody {String} [user_text] Uusi teksti.
 * @apiBody {Number} [workload] Uusi kuormitusarvo.
 * @apiBody {Number} [mood_score] Uusi fiilisarvo.
 *
 * @apiSuccess {String} message Merkintä päivitetty.
 */
entryRouter.patch('/:id', EntryController.updateUserEntry);

/**
 * @api {delete} /api/entries/:id Poista kirjaus
 * @apiDescription Poistaa tietyn päivittäisen merkinnän pysyvästi.
 * @apiName DeleteEntry
 * @apiGroup Entries
 * @apiHeader {String} Authorization Bearer-token.
 *
 * @apiParam {Number} id Poistettavan merkinnän ID.
 *
 * @apiSuccess {String} message Merkintä poistettu.
 */
entryRouter.delete('/:id', EntryController.deleteUserEntry);

export default entryRouter;
