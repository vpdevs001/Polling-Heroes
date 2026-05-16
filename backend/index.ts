import "dotenv/config";
import { createServer } from "http";
import app from "./src/app.js";
import { initSocket } from "./src/modules/socket/socket.js";

const PORT = process.env.PORT ?? "4000";

const start = async () => {
  const httpServer = createServer(app);
  initSocket(httpServer);
  httpServer.listen(Number(PORT), () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
};

start().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});
