import userModel from "../../../../DB/models/User.model.js";
import messageModel from "../../../../DB/models/Message.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";

export const getMessageModule = asyncHandler(async (req, res, next) => {
  const messageList = await messageModel.find({ receiverId: req.user._id });
  return res.json({ Msg: "Done", messageList });
});

export const sendMessage = asyncHandler(async (req, res, next) => {
  const { receiverId } = req.params;
  const { message } = req.body;
  const user = await userModel.findById(receiverId);
  if (!user) {
    // return res.status(404).json({ Msg: "In-valid account ID" });
    return next(new Error("In-valid account ID", { cause: 404 }));
  }
  const createMessage = await messageModel.create({
    receiverId: user._id,
    message,
  });
  return res.status(201).json({ Msg: "Done", createMessage });
});

export const deleteMessage = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const message = await messageModel.deleteOne({
    _id: id,
    receiverId: req.user._id,
  });

  return message.deletedCount
    ? res.status(200).json({ message: "Done" })
    : next(new Error("In-valid message or ownerId", { cause: 400 }));
});
