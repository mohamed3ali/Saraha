import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const signupSchema = {
  body: joi
    .object({
      userName: joi.string().alphanum().min(2).max(25).required().messages({
        "string.empty": "Please fill in your userName",
        "any.required": "userName is required",
      }),
      age: joi.number().integer().min(16).max(150).required(),
      gender: joi.string().alphanum().valid("male", "female").required(),
      email: generalFields.email,
      password: generalFields.password,
      cPassword: generalFields.cPassword.valid(joi.ref("password")),
    })
    .required(),
  // query: joi
  //   .object({
  //     flag: joi.boolean().required(),
  //   })
  //   .required(),
};

export const loginSchema = {
  body: joi
    .object({
      email: generalFields.email,
      password: generalFields.password,
    })
    .required(),
};
