

const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
  mongoose
    .connect(process.env.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("DB connected successfully");
    })
    .catch((err) => {
      console.log("DB connection issue:", err);
    });
};
