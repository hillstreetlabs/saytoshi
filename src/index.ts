require("dotenv").config();

import createApp from "./app";

async function start() {
  const app = await createApp();

  const port = process.env.PORT || 1337;

  app.listen(port, () => {
    console.log("Listening on port " + port);
  });
}
start();
