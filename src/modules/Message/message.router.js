import { Router } from "express";
import * as messageController from "./controller/message.js";
import auth from "../../middleware/auth.middleware.js";
import validation from "../../middleware/validation.js";
import * as validators from "./message.validation.js";
const router = Router();

router.get("/", auth, messageController.getMessageModule);
router.post(
  "/:receiverId",
  validation(validators.sendMessage),
  messageController.sendMessage
);
router.delete(
  "/:id",
  validation(validators.deleteMessage),
  auth,
  messageController.deleteMessage
);
export default router;
