import "dotenv/config";
import express, { type Express } from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";

export type CreateApiAppOptions = {
  trpcRootFallback?: boolean;
};

const createTrpcMiddleware = () =>
  createExpressMiddleware({
    router: appRouter,
    createContext,
  });

export function createApiApp(options: CreateApiAppOptions = {}): Express {
  const app = express();

  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  registerStorageProxy(app);
  registerOAuthRoutes(app);
  // tRPC API
  app.use("/api/trpc", createTrpcMiddleware());
  if (options.trpcRootFallback) {
    app.use("/", createTrpcMiddleware());
  }

  return app;
}
