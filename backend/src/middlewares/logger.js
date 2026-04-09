const requestLogger = (req, res, next) => {
  console.log(new Date().toLocaleString('fi-EN'), req.method, req.url);
  if (req.body) {
    console.log('body:', req.body);
  }
  next();
};

export default requestLogger;
