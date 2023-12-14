import userRouter from "./modules/User/user.router.js";
import messageRouter from "./modules/Message/message.router.js";
import authRouter from "./modules/Auth/auth.router.js";
import connectDB from "../DB/connection.js";
import { globalErrorHandling } from "./utils/errorHandling.js";
const initApp = (app, express) => {
  //Convert Buffer Data
  app.use(express.json({}));
  //App Routing
  app.get("/", (req, res) => res.send("Hello World!"));
  app.use("/user", userRouter);
  app.use("/message", messageRouter);
  app.use("/auth", authRouter);
  app.all("*", (req, res, next) => {
    return res.json({ Msg: "In-valid Routing" });
  });
  //Error handling middleware
  app.use(globalErrorHandling);
  //connection DB
  connectDB();
};

export default initApp;
