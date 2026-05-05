import jwt from 'jsonwebtoken';
import 'dotenv/config';

const authenticateToken = (req, res, next) => {
  //console.log('authenticateToken', req.headers);
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  //console.log('token', token);
  if (token == undefined) {
    return res.sendStatus(401);
  }
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    console.log('token verification failed', error);
    res.status(401).send({message: 'invalid token'});
  }
};

// Stops the user from accessing professional only endpoints
const requireProfessional = (req, res, next) => {
  if (req.user.role !== 'professional') {
    return res.status(403).json({ message: 'Access denied. Professionals only.' });
  }
  next();
};

export {authenticateToken, requireProfessional};
