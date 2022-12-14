import mongoose from "mongoose";
import User from "../schemas/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Signup api

export const signup = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = new User({ ...req.body, password: hash });
    await newUser.save();
    res.status(200).send("User Created Successfully...");
  } catch (error) {
    next(error);
  }
};

// Sign in API

export const signin = async (req, res) => {
  try {
    // Find User
    const user = await User.findOne({ name: req.body.name });
    if (!user) {
      res.status(404).send("User not found!");
      return;
    }

    const isCorrect = bcrypt.compare(req.body.password, user.password);
    if (!isCorrect) {
      res.status(400).send("Wrong Credentials!");
      return;
    }

    const { password, ...others } = user._doc;

    const token = jwt.sign({ id: user._id }, process.env.JWT);
    

    res
      .cookie("access_token", token, {
        httpOnly: true
      })
      .status(200)
      .json(others);
  } catch (error) {
    res.send(error);
  }
};

export const googleAuth = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT);
      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json(user._doc);
    } else {
      const newUser = new User({
        ...req.body,
        fromGoogle: true,
      });
      const savedUser = await newUser.save()
      const token = jwt.sign({ id: savedUser._id }, process.env.JWT);
      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json(savedUser._doc);
    }
  } catch (error) {
    res.send(error)
  }
};
