import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import initApp from "./src/app.router.js";
// import sendEmail from "./src/utils/sendEmail.js";
const app = express();
const port = 5000;

// const user = {
//   body:,
// };
initApp(app, express);
// sendEmail({
//   to: "moali8938@gmail.com",
//   subject: "testEmail",
//   html: "<h2>how are you mo</h2>",
//   attachments: [
//     {
//       filename: "text.bin",
//       content: "hello world!",
//       contentType: "text/plain",
//     },
//     {
//       filename: "cv.pdf",
//       contentType: "application/pdf",
//       path: "./",
//     },
//   ],
// });
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
