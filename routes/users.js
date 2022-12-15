// I M P O R T:  E X T E R N A L  D E P E N D E N C I E S
import express from 'express';

// I M P O R T:  F U N C T I O N S
import {validateRequest} from '../middleware/validator.js'
import { userValidator, userUpdateValidator } from '../middleware/userValidator.js';

// I M P O R T:  C O N T R O L L E R
import {
  usersGetAll, 
  usersPostUser, 
  usersGetSpecific, 
  usersPutSpecific, 
  usersDeleteSpecific,
  usersPostLogin
} from '../controller/usersController.js';

import { auth } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';

// ========================

// C R E A T E  R O U T E S
const router = express.Router();

router
  .route('/')
    .get(auth, admin, usersGetAll)
    .post(userUpdateValidator, validateRequest, usersPostUser);

router
  .route('/:id')
    .get(auth, usersGetSpecific)
    .put(userUpdateValidator, validateRequest, auth, usersPutSpecific)
    .delete(auth, usersDeleteSpecific);

router
  .route('/login')
    .post(usersPostLogin)

  export default router;
