import { compare, hash } from "../../../utils/hashAndCompare.js";
import userModel from "../../../../DB/models/User.model.js";
import {
  generateToken,
  verifyToken,
} from "../../../utils/generateAndVerifyToken.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import { loginSchema, signupSchema } from "../auth.validation.js";
import sendEmail from "../../../utils/sendEmail.js";

// import asyncHandler from "express-async-handler";
export const getAuthModule = (req, res, next) => {
  return res.json({ Msg: "Auth module" });
};
export const signup = asyncHandler(async (req, res, next) => {
  // try {

  const { userName, email, password } = req.body;

  console.log({ userName, email, password });
  const user = await userModel.findOne({ email });
  if (user) {
    // return res.json({ Msg: "Email Exist" });
    return next(new Error("Email Exist", { cause: 409 }));
  }
  const token = generateToken({
    payload: { email },
    signature: process.env.EMAIL_TOKEN,
    expiresIn: 60 * 5,
  });
  const link = `${req.protocol}://${req.header.host}/auth/confirmEmail/${token}`;
  const refreshToken = generateToken({
    payload: { email },
    signature: process.env.EMAIL_TOKEN,
    expiresIn: 60 * 60 * 24 * 30,
  });
  const refreshLink = `${req.protocol}://${req.header.host}/auth/newConfirmEmail/${refreshToken}`;
  const html = `<a href="${link}">Click me to confirm your email now.</a>
  <br> <br>
  <a href="${refreshLink}">Request New Email.</a>
   `;
  const info = await sendEmail({ to: email, subject: "confirm Email", html });
  if (!info) {
    return next(new Error("Email not", { cause: 400 }));
  }
  const hashPassword = hash({ plaintext: password });
  const createUser = await userModel.create({
    userName,
    email,
    password: hashPassword,
  });
  return res.status(201).json({ Msg: "Done", user: createUser._id });
  // } catch (error) {
  //   return res.json({ Msg: "Catch error", error, stack: error.stack });
  // }
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  console.log({ email, password });
  const user = await userModel.findOne({ email });
  if (!user) {
    // return res.json({ Msg: "Email not Exist" });
    return next(new Error("Email not Exist"));
  }
  const match = compare({ plaintext: password, hashValue: user.password });
  if (!match) {
    // return res.json({ message: "In-valid Password" });
    return next(new Error("In-valid Password"));
  }
  const access_token = generateToken({
    payload: { id: user._id, isLoggedIn: true, role: user.role },
  });
  user.status = "online";
  await user.save();
  return res.status(200).json({ Msg: "Done", access_token });
});

export const confirmEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const { email } = verifyToken({ token, signature: process.env.EMAIL_TOKEN });
  const user = await userModel.updateOne({ email }, { confirmEmail: true });
  return user.modifiedCount
    ? res.status(200).redirect("https://waliye.men.gov.ma/moutamadris/Account")
    : res.status(404).send("Not register account");
});

export const newConfirmEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const { email } = verifyToken({ token, signature: process.env.EMAIL_TOKEN });

  const newToken = generateToken({
    payload: { email },
    signature: process.env.EMAIL_TOKEN,
    expiresIn: 60 * 2,
  });
  const link = `${req.protocol}://${req.header.host}/auth/confirmEmail/${newToken}`;
  const refreshToken = generateToken({
    payload: { email },
    signature: process.env.EMAIL_TOKEN,
    expiresIn: 60 * 60 * 24 * 30,
  });
  const html = `<a href="${link}">Click me to confirm your email now.</a>
  <br> <br>
  <a href="${refreshLink}">Request New Email.</a>
   `;
  const info = await sendEmail({ to: email, subject: "confirm Email", html });
  if (!info) {
    return next(new Error("Rejected email", { cause: 400 }));
  }
  return res.status(200).send("<p>DOne please check your email .</p>");
});
