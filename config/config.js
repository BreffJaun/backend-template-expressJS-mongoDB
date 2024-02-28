// I M P O R T:  E X T E R N A L  D E P E N D E N C I E S
import "dotenv/config";

// ==============================================================

// D B  C O N N E C T I O N  S T R I N G
export const MONGO_DB_CONNECTION_STRING =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority` ||
  "mongodb://localhost:27017";

// S E R V E R - P O R T
export const PORT = process.env.PORT || 4000;

// I M P O R T  &  D E C L A R E   B C R Y P T   K E Y
export const JWT_KEY = process.env.SECRET_JWT_KEY || "DefaultValue";
// export const JWT_EXPIRATION = process.env.SECRET_JWT_EXPIRATION || '1h';

// S E T  C O R S  S E T T I N G S
const CORS_ORIGINS = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",")
  : "*";
export const corsOptions = {
  origin: CORS_ORIGINS,
  credentials: true,
  // ...
};

// E R R O R  H A N D L I N G  S E T T I N G S
export const ERROR_HANDLING_OPTIONS = {
  // showStack: process.env.NODE_ENV === "development",
  // Further error handling options...
};
