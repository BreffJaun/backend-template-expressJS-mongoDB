// I M P O R T:  E X T E R N A L  D E P E N D E N C I E S
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

// I M P O R T:  F U N C T I O N S
import UserModel from '../models/userModel.js';

// I M P O R T  &  D E C L A R E   B C R Y P T   K E Y 
const JWT_KEY = process.env.SECRET_JWT_KEY || "DefaultValue"

//========================

// GET List of all users
export async function usersGetAll (req, res, next) {
  try {
    res.json(await UserModel.find());
  }catch (err) {
    next(err);
  }
}

// POST (Add) a new User
export async function usersPostUser (req, res,next) {
  try {
    const newUser = req.body;
    // check or ensure that the e-mail address do not exist multiple times in the database.
    const existedUser = await UserModel.findOne({email: newUser.email});
    if(existedUser) {
      const err = new Error('There is already a user with this email-address');
      err.statusCode = 400;
      throw err;
    }
    const hashedPassword = await bcrypt.hash(newUser.password, 10);
    const {firstName, lastName, email, address, _id} = await UserModel.create({...newUser, password: hashedPassword})
    res.status(201).json({firstName, lastName, email, address, _id});
  }catch (err) {
    next(err);
  }
};

// GET a specific User
export async function usersGetSpecific(req, res, next) {
  try {
    if (!(await UserModel.findById(req.params.id))){
      const err = new Error("No USER with this id in Database!");
      err.statusCode = 422;
      throw err; 
    } 
    res.status(200).json(await UserModel.findById(req.params.id));
  }catch (err) {
    next(err);
  }
};

// PATCH (Update) specific User
export async function usersPutSpecific(req, res, next) {
  try {
    if (req.params.id !== req.token.userId) {
      const err = new Error("Not Authorized!");
      err.statusCode = 401;
      throw err;
    }
    const userData = req.body;
    const userFromDb = await UserModel.findOne({email: userData.email});
    if(userFromDb) {
      const err = new Error("There is no user with this email!");
      err.statusCode = 401;
      throw err; 
    }
    if(req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const {firstName, lastName, email, address, _id} = await UserModel.create({...newUser, password: hashedPassword})
      res.status(201).json({firstName, lastName, email, address, _id});
    } else {
      const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
      res.json(user)
    }
  }catch (err) {
    next(err);
  }
};

// Delete specific User
export async function usersDeleteSpecific (req, res, next) {
  try {
    if (req.params.id !== req.token.userId) {
      const err = new Error("Not Authorized! DELETE");
      err.statusCode = 401;
      throw err;
    }
    res.status(200).json(await UserModel.findByIdAndDelete(req.params.id));
  }catch (err) {
    next(err);
  }
}

// POST Login a User
export async function usersPostLogin(req, res, next) {
  try {
    const userData = req.body;
    const userFromDb = await UserModel.findOne({email: userData.email});
    if(!userFromDb) {
      const err = new Error("There is no user with this email!");
      err.statusCode = 401;
      throw err; 
    }
    const checkPassword = await bcrypt.compare(userData.password, userFromDb.password);
    if(!checkPassword) {
      const err = new Error("Invalid password!");
      err.statusCode = 401;
      throw err; 
    }
    const token = jwt.sign(
      {
        email: userFromDb.email, 
        userId: userFromDb._id
      }, 
      JWT_KEY, 
      {expiresIn: "1d"})
      // INSERT COOKIE CODE //
      const oneHour = 1000*60*60;
      res.cookie('loginCookie', token, 
      {
        maxAge: oneHour,
        httpOnly: true
      })
      .json(
      {
        auth: 'loggedin',
        email: userFromDb.email, 
        userId: userFromDb._id,
        message: "Login SUCCESSFUL!"
      })
      // END COOKIE CODE //
      // res.status(201).json({message: "Login SUCCESSFUL!", token})
  } catch (err) {
    next(err);
  }
};

// GET Check if User is already loggedin (if token is still valid)
export async function usersChecklogin(req, res, next) {
  try {
    const token = req.cookies.loginCookie
    const tokenDecoded = jwt.verify(token, JWT_KEY)
    console.log('Token in Cookie is valid. User is loggedin');
    res.status(200).end();
  } catch (err) {
    next(err);
    // res.status(401).end()
  }
};


