import commandLineArgs from "command-line-args";
import dotenv from "dotenv";
import path from "path";

(() => {
  // Setup command line options
  const options = commandLineArgs([
    {
      name: "env",
      alias: "e",
      defaultValue: "development",
      type: String,
    },
  ]);
  // Set the env file
  const result2 = dotenv.config({
    path: path.join(__dirname, `env/${options.env}.env`),
  });
  if (result2.error) {
    throw result2.error;
  }
})();

import "./mongoose";
import "./passport";
import "./swagger";
