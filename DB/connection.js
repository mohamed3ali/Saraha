import mongoose from "mongoose";

const connectDB = async () => {
  return await mongoose
    .connect(process.env.DB_LOCAL)
    .then((result) => {
      console.log(`DB connected successfully........`);
    })
    .catch((err) => {
      console.log(`Fail connected.......${err}`);
    });
};
export default connectDB;
