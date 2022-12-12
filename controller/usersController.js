// I M P O R T:  E X T E R N A L  D E P E N D E N C I E S
import bcrypt from 'bcrypt';

// I M P O R T:  F U N C T I O N S
import UserModel from '../models/userModel.js';

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
    const existedUser = await UserModel.findOne({email: newUser.email})
    if(existedUser) {
      const err = new Error('There is already a user with this email-address');
      err.statusCode = 400;
      throw err;
    }
    const hashedPassword = await bcrypt.hash(newUser.password, 10);
    res.status(201).json(await UserModel.create({...newUser, password: hashedPassword}))
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

// PUT (Update) specific User
export async function usersPutSpecific(req, res, next) {
  try {
    res.status(200).json(await UserModel.findByIdAndUpdate(req.params.id, req.body, {new:true}));
  }catch (err) {
    next(err);
  }
};

// Delete specific User
export async function usersDeleteSpecific (req, res, next) {
  try {
    res.status(200).json(await UserModel.findByIdAndDelete(req.params.id));
  }catch (err) {
    next(err);
  }
}


