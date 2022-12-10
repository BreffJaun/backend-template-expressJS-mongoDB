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
    res.status(200).json(await UserModel.create(req.body));
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


