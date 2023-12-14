import { Router } from "express";
import * as userController from "./controller/user.js";
import auth from "../../middleware/auth.middleware.js";
import validation from "../../middleware/validation.js";
import * as validators from "./user.validation.js";
const router = Router();

router.get("/profile", auth, userController.profile);
router.patch(
  "/password",
  validation(validators.updatePassword),
  auth,
  userController.updatePassword
);
router.get(
  "/:id/profile",
  validation(validators.shareProfile),
  userController.shareProfile
);
export default router;
