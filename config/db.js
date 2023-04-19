const mongoose = require("mongoose");

console.log(process.env.CONNECTION_STRING);
mongoose
  .connect(
    `mongodb://${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`
  )
  .then(() => {
    console.log("database connected succesfully");
  })
  .catch((err) => console.log(err.message, "connection failed!"));
