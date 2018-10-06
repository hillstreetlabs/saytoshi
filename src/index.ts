require("dotenv").config();

import createApp from "./app";

async function start() {
  const { server, watcher } = await createApp();

  const port = process.env.PORT || 1337;

  watcher.start();
  server.listen(port, () => {
    console.log("Listening on port " + port);
  });
}
start();
