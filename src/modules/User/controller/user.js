import userModel from "../../../../DB/models/User.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import { compare, hash } from "../../../utils/hashAndCompare.js";

export const profile = async (req, res, next) => {
  const user = await userModel.findById(req.user._id);
  return res.json({ Msg: "Done", user });
};

export const updatePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const user = await userModel.findById(req.user._id);
  const match = compare({ plaintext: oldPassword, hashValue: user.password });
  if (!match) {
    return next(new Error("In-valid old password", { cause: 400 }));
  }
  const hashPassword = hash({ plaintext: newPassword });
  user.password = hashPassword;
  await user.save();
  return res.status(200).json({ msg: "Done" });
});

export const shareProfile = asyncHandler(async (req, res, next) => {
  const user = await userModel
    .findById(req.params.id)
    .select("userName email profilePic firstName lastName");
  return user
    ? res.status(200).json({ Msg: "Done", user })
    : next(new Error("In-valid account ID", { cause: 404 }));
});
