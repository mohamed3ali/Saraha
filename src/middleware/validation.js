import joi from "joi";

const dataMethods = ["body", "query", "params", "headers"];

export const generalFields = {
  password: joi
    .string()
    .pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/))
    .required(),
  email: joi
    .string()
    .email({
      minDomainSegments: 2,
      maxDomainSegments: 3,
      tlds: { allow: ["com", "net", "edu"] },
    })
    .required(),
  cPassword: joi.string().required(),
  id: joi.string().min(24).max(24).required(),
};

const validation = (schema) => {
  return (req, res, next) => {
    const validationArr = [];

    dataMethods.forEach((key) => {
      if (schema[key]) {
        const validationResult = schema[key].validate(req[key], {
          abortEarly: false,
        });
        if (validationResult.error) {
          validationArr.push(validationResult.error.details);
        }
      }
    });
    if (validationArr.length > 0) {
      return res.json({ Msg: "Validation error", validationArr });
    } else {
      return next();
    }
  };
};
export default validation;
