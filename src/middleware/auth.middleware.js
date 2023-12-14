import userModel from "../../DB/models/User.model.js";
import { asyncHandler } from "../utils/errorHandling.js";
import { verifyToken } from "../utils/generateAndVerifyToken.js";

const auth = asyncHandler(async (req, res, next) => {
  const { authorization } = req.headers;
  console.log({ authorization });

  if (!authorization?.startsWith(process.env.BEARER_KEY)) {
    return res.json({ Msg: "In-valid bearer key" });
  }
  const token = authorization.split(process.env.BEARER_KEY)[1];
  console.log({ token });
  if (!token) {
    return res.json({ Msg: "In-valid token" });
  }
  const decoded = verifyToken({ token });
  if (!decoded?.id) {
    return res.json({ Msg: "In-valid token payload" });
  }
  console.log({ decoded });
  const authUser = await userModel
    .findById(decoded.id)
    .select("userName email status role");
  if (!authUser) {
    return res.json({ Msg: "Not register Account" });
  }
  req.user = authUser;
  return next();
});
export default auth;
