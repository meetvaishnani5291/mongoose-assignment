const mongoose = require("mongoose");
const chalk = require("chalk");

const app = require("./express/app");

const PORT = process.env.SERVER_PORT;
const HOST = process.env.SERVER_HOST;
const DATABASE_CONNECTION_STRING = `mongodb://${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`;

async function assertDatabaseConnectionOk() {
  console.log(chalk.bgCyan.bold(`Checking database connection...`));
  try {
    mongoose.set("debug", true);
    await mongoose.connect(DATABASE_CONNECTION_STRING);
    console.log(chalk.bgGreen.bold("Database connection OK!"));
  } catch (error) {
    console.log(chalk.bgRed("Unable to connect to the database:"));
    console.log(chalk.bgRed(error.message));
    process.exit(1);
  }
}

async function init() {
  await assertDatabaseConnectionOk();
  console.log(chalk.bgCyan.bold(`Starting Express server on port ${PORT}...`));
  app.listen(PORT, () => {
    console.log(chalk.bgGreen.bold(`Express server started on port ${PORT}`));
  });
}
init();
