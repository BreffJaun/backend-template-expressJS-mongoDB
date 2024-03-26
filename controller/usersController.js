// I M P O R T:  E X T E R N A L  D E P E N D E N C I E S
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// I M P O R T:  F U N C T I O N S
import UserModel from "../models/userModel.js";
import { sendMail } from "../services/nodeMailer/nodeMailerConfig.js";

// I M P O R T:  E N V  O P T I O N S
import { JWT_KEY, BE_HOST, cookieAge } from "../config/config.js";
import { createVerifyToken } from "../services/jwt/jwt.js";

//========================

// GET List of all users ✅
export const usersGetAll = async (req, res, next) => {
  try {
    res.json(await UserModel.find());
  } catch (err) {
    next(err);
  }
};

// POST (Add) a new User ✅
export const usersPostUser = async (req, res, next) => {
  try {
    const kof = "registration"; // kof => "kind of function"
    const newUser = req.body;
    const hashedPassword = await bcrypt.hash(newUser.password, 10);
    const createdUser = await UserModel.create({
      ...newUser,
      password: hashedPassword,
    });

    // AVATAR IMPLEMENT BEGIN //
    if (req.file) {
      await UserModel.findByIdAndUpdate(createdUser._id, {
        avatar: `${BE_HOST}${req.file.path}`,
      });
    }
    // AVATAR IMPLEMENT END //

    // VERIFY EMAIL IMPLEMENT BEGIN //
    await sendMail(createdUser, kof);
    // VERIFY EMAIL IMPLEMENT END //

    res.status(201).json({
      message:
        "Please verify your account via the link in the email we send you, to use your Profile.",
    });
  } catch (err) {
    next(err);
  }
};

// GET Verify new User via Email ✅
export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, JWT_KEY);
    } catch (error) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }
    const id = decodedToken._id;
    const user = await UserModel.findByIdAndUpdate(id, { isVerified: true });
    res.json({ message: "E-Mail is now SUCCESSFULLY verified!" });
    // res.redirect('http://localhost:2404/login')
    // if we have a frontend, we can redirect the successful verification to the login page
  } catch (err) {
    next(err);
  }
};

// POST Request email for forgotten password ✅
export const forgotPassword = async (req, res, next) => {
  try {
    const kof = "forgotPassword"; // kof => "kind of function"
    const { email } = req.body;
    const userFromDb = await UserModel.findOne({ email });
    if (!userFromDb) {
      const err = new Error("There is no user with this email!");
      err.statusCode = 401;
      throw err;
    }

    // RESET EMAIL IMPLEMENT BEGIN //
    await sendMail(userFromDb, kof);
    // RESET EMAIL IMPLEMENT END //

    res
      .status(201)
      .json({ message: "You got send an Email to set your new password." });
  } catch (err) {
    next(err);
  }
};

// POST Change (forgotten) password after email request ✅
export const setNewPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    let decodedToken = jwt.verify(token, JWT_KEY);
    let user;
    let id;
    if (!password) {
      // After click on Email Link !
      if (decodedToken) {
        id = decodedToken._id;
        user = await UserModel.findByIdAndUpdate(
          id,
          {
            isVerifiedTCP: true,
          },
          { new: true }
        );
        return res
          .status(201)
          .json({ message: "User is now verified to change password." });
      } else {
        return res.status(400).json({ message: "Invalid or expired token." });
      }
    }
    // If you are here, you clicked on the link in the email and set isVerifiedTCP to "true"
    id = decodedToken._id;
    user = await UserModel.findById(id);
    if (password && user.isVerifiedTCP) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const updatedUser = await UserModel.findByIdAndUpdate(
        id,
        {
          password: hashedPassword,
          isVerifiedTCP: false,
        },
        { new: true }
      );
      res.json({ message: "Set new Password was SUCCESSFUL!" });
    } else {
      res.status(400).json({
        message:
          "Password change failed. Please ensure you have verified your email.",
      });
    }
  } catch (err) {
    next(err);
  }
};

// GET a specific User ✅
export const usersGetSpecific = async (req, res, next) => {
  try {
    if (!(await UserModel.findById(req.params.id))) {
      const err = new Error("No USER with this id in Database!");
      err.statusCode = 422;
      throw err;
    }
    res.status(200).json(await UserModel.findById(req.params.id));
  } catch (err) {
    next(err);
  }
};

// PATCH (Update) specific User ✅
export const usersPatchSpecific = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, password, avatar } = req.body;
    const updates = {};

    if (id !== req.token.userId) {
      const err = new Error("Not Authorized!");
      err.statusCode = 401;
      throw err;
    }

    if (firstName) updates.firstName = firstName;
    if (lastName) updates.lastName = lastName;

    if (email) {
      const userFromDb = await UserModel.find({ email }, { _id: { $ne: id } });
      if (userFromDb.length > 0) {
        const err = new Error("There is already a user with this email!");
        err.statusCode = 401;
        throw err;
      }
      updates.email = email;
    }

    if (password) {
      updates.password = await bcrypt.hash(password, 10);
    }

    if (req.file) {
      updates.avatar = `${BE_HOST}${req.file.path}`;
    }

    const updatedUser = await UserModel.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedUser) {
      const err = new Error("User not found!");
      err.statusCode = 404;
      throw err;
    }

    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
};

// DELETE specific User ✅
export const usersDeleteSpecific = async (req, res, next) => {
  try {
    if (req.params.id !== req.token.userId) {
      const err = new Error("Not Authorized to delete this user!");
      err.statusCode = 401;
      throw err;
    }

    const deletedUser = await UserModel.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      const err = new Error("User not found!");
      err.statusCode = 404;
      throw err;
    }
    res.status(200).json({ message: "User deleted successfully." });
  } catch (err) {
    next(err);
  }
};

// POST Login a User ✅
export const usersPostLogin = async (req, res, next) => {
  try {
    const userData = req.body;
    const userFromDb = await UserModel.findOne({ email: userData.email });
    if (!userFromDb) {
      const err = new Error("There is no user with this email!");
      err.statusCode = 401;
      throw err;
    }
    const isVerified = userFromDb.isVerified;
    if (!isVerified) {
      const err = new Error(
        "User is not verified yet, please verify your account using the link in your email we send you. If the link is older than an hour, please request a new one."
      );
      err.statusCode = 401;
      throw err;
    }
    const checkPassword = await bcrypt.compare(
      userData.password,
      userFromDb.password
    );
    if (!checkPassword) {
      const err = new Error("Invalid password!");
      err.statusCode = 401;
      throw err;
    }
    const token = createVerifyToken(userFromDb);
    // INSERT COOKIE CODE BEGIN //
    res
      .cookie("loginCookie", token, {
        maxAge: cookieAge.oneHour,
        httpOnly: true,
        sameSite: "none",
        secure: true,
      })
      .json({
        auth: "loggedin",
        email: userFromDb.email,
        userId: userFromDb._id,
        message: "Login SUCCESSFUL!",
      });
    // INSERT COOKIE CODE END //
  } catch (err) {
    next(err);
  }
};

// GET Check if User is already loggedin (if token is still valid) ✅
export const usersChecklogin = async (req, res, next) => {
  try {
    const token = req.cookies.loginCookie;
    try {
      const tokenDecoded = jwt.verify(token, JWT_KEY);
      console.log("Token in Cookie is valid. User is loggedin");
      res.status(200).json({ message: "User is logged in." });
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        err.message = "Token has expired. Please log in again.";
        err.statusCode = 401;
      } else if (err instanceof jwt.JsonWebTokenError) {
        err.message = "Invalid token. Please log in again.";
        err.statusCode = 401;
      }
      next(err);
    }
  } catch (err) {
    next(err);
  }
};

// GET Logout a User ✅
export const usersGetLogout = async (req, res, next) => {
  try {
    res.clearCookie("loginCookie", { sameSite: "none", secure: true });
    res.status(200).json({ message: "Logout SUCCESSFULLY!" });
  } catch (err) {
    next(err);
  }
};

// ======================================================
