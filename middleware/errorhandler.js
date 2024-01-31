// E R R O R   H A N D L E R
const errorHandler = (err, req, res, next) => {
  // CONSOLE OUTPUT
console.log("\n========= E R R O R =========");
console.error(`Name: ${err.name}\nMessage: ${err.message}\nStatusCode: ${err.statusCode || 'N/A'}`);
console.log("========= E R R O R =========\n");


  // RESPONSE OUTPUT
  const statusCode = err.statusCode || 500; 
  res.status(statusCode).send({
    error: {
      status: statusCode,
      message: err.message || 'Internal Server Error'
    }
  });
};

export {errorHandler};