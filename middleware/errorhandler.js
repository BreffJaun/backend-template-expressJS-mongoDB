// I M P O R T:  E R R O R  H A N D L I N G  O P T I O N S
import { ERROR_HANDLING_OPTIONS } from "../config/config.js";

// E R R O R   H A N D L E R
const errorHandler = (err, req, res, next) => {
  // CONSOLE OUTPUT
console.log("\n========= E R R O R =========");
console.error(`Name: ${err.name}\nMessage: ${err.message}\nStatusCode: ${err.statusCode || 'N/A'}`);
console.log("========= E R R O R =========\n");


  // RESPONSE OUTPUT
  const statusCode = err.statusCode || 500; 
  let errorResponse = {
    error: {
      status: statusCode,
      message: err.message || 'Internal Server Error'
    }
  };

  // Check whether stack traces should be displayed
  if (ERROR_HANDLING_OPTIONS.showStack && process.env.NODE_ENV === 'development') {
    errorResponse.error.stack = err.stack;
  }
  res.status(statusCode).send(errorResponse);
};

export {errorHandler};