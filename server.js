// I M P O R T:  E X T E R N A L  D E P E N D E N C I E S
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from "cookie-parser";

// I M P O R T:  E N V 
import { PORT } from './config/config.js';

// I M P O R T:  C O M P O N E N T S 
import { connectToDatabase } from './config/database.js';

// I M P O R T:  R O U T E S
import usersRouter from './routes/users.js';
import wrongRoutes from './routes/wrongPath.js';

// I M P O R T:  E R R O R  H A N D L E R
import { errorHandler } from './middleware/errorhandler.js';

// ==============================================================

// C R E A T E  S E R V E R
const app = express();

// M I D D L E W A R E

// SERVER MIDDLEWARE
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());
app.use(cors(
  // {
  //   origin: 'http://localhost:3000', // fill in here render address
  // if you want to add more adresses in cors, make an array with single strings.
  //   credentials: true
  // }
  )
);
app.use(morgan("dev"));

// ROUTER MIDDLEWARE
// USERS
app.use('/users', usersRouter);


// WRONG PATH HANDLER
app.use('*', wrongRoutes);

// ERROR HANDLER
app.use(errorHandler);

// ==============================================================

// C O N N E C T   W I T H   M O N G O O S E  D B
connectToDatabase();

// S E R V E R - S T A R T
app.listen(PORT, () => {
  console.log('Server runs on Port: ' + PORT, '🔄');
});




