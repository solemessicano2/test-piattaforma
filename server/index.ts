import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import driveRoutes from "./routes/drive-upload";
import testEnvRoutes from "./routes/test-env";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Google Drive routes
  app.use("/api/drive", driveRoutes);

  // Test routes
  app.use("/api/test", testEnvRoutes);

  return app;
}
