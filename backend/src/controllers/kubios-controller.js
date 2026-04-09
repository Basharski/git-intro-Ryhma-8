import fetch from 'node-fetch';
//import {customError} from '../middlewares/error-handlers.js';

 // Kubios API base URL should be set in .env
 const baseUrl = process.env.KUBIOS_API_URI;

 /**
 * Get user data from Kubios API example
 * TODO: Implement error handling
 * @async
 * @param {Request} req Request object including Kubios id token
 * @param {Response} res
 * @param {NextFunction} next
 */
 const getUserData = async (req, res) => {
   const {kubiosIdToken} = req.user;
   const headers = new Headers();
   headers.append('User-Agent', process.env.KUBIOS_USER_AGENT);
   headers.append('Authorization', kubiosIdToken);

   const response = await fetch(
     // TODO: set the from date more sophisticated way
     // in this example, data from 1.1.2024 is requested and hardcoded in the URL,
     // but it should be dynamic based on for example request parameters or some other date handling logic
     baseUrl + '/result/self?from=2024-01-01T00%3A00%3A00%2B00%3A00',
     {
       method: 'GET',
       headers: headers,
     },
   );
   const results = await response.json();

   // Kubiokselta saatua dataa voi käsitellä (palvelipuolella) tässä
   // ennen responsen lähettämistä client-sovellukselle

   return res.json(results);
 };

 /**
 * Get user info from Kubios API example
 * TODO: Implement error handling
 * @async
 * @param {Request} req Request object including Kubios id token
 * @param {Response} res
 * @param {NextFunction} next
 */
 const getUserInfo = async (req, res) => {
   const {kubiosIdToken} = req.user;
   const headers = new Headers();
   headers.append('User-Agent', process.env.KUBIOS_USER_AGENT);
   headers.append('Authorization', kubiosIdToken);

   const response = await fetch(baseUrl + '/user/self', {
     method: 'GET',
     headers: headers,
   });
   const userInfo = await response.json();
   return res.json(userInfo);
 };

 export {getUserData, getUserInfo};
