import type { Context } from "aws-lambda";
import { connect as _connect } from "mongoose";
import type { Mongoose } from "mongoose";
import { logger } from "../io/logger";
import { getEnv, getEnvName } from "../utils/env";

const cachedClientMap: Map<string, Promise<Mongoose>> = new Map();

async function getClient(url: string): Promise<Mongoose> {
  logger.info("[mongo/client:getClient]: connecting to mongodb");

  let cachedClient = cachedClientMap.get(url) ?? null;
  if (cachedClient) {
    logger.info("[mongo/client:getClient]: using cached mongodb client");
    return cachedClient;
  }

  try {
    cachedClient = _connect(url, {
      appname: `room-service-${getEnvName()}`,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 10_000,
      socketTimeoutMS: 30_000,
      keepAlive: true,
      keepAliveInitialDelay: 300_000,
      useFindAndModify: false,
      useCreateIndex: true,
    });

    cachedClientMap.set(url, cachedClient);

    const client: Mongoose = await cachedClient;

    logger.info("[mongo/client:connect]: connected to mongodb", {
      url,
    });

    client.connection.on("error", (err) => {
      logger.error(err, "[mongo/client:event]: error");
    });

    client.connection.on("reconnectFailed", (err) => {
      logger.error(err, "[mongo/client:event]: reconnectFailed");
      cachedClientMap.delete(url);
    });

    client.connection.on("disconnected", () => {
      logger.error(new Error("[mongo/client:event]: disconnected"));
    });

    client.connection.on("connected", () => {
      logger.warn("[mongo/client:event]: disconnected");
    });

    client.connection.on("close", () => {
      logger.warn("[mongo/client:event]: close");
      cachedClientMap.delete(url);
    });

    return client;
  } catch (e) {
    const message = "[mongo/client:connect]: unable to connect to mongodb";
    logger.error(e, message);
    throw new Error(message);
  }
}

export async function connect(context: Context): Promise<Mongoose> {
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false;
  // mongoose.set("debug", true);

  return getClient(getEnv("MONGO_DB_URL"));
}
