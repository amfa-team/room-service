import { helloWorld } from "@amfa-team/shared";
import type { HelloData, HelloPayload } from "@amfa-team/types";
import { JsonDecoder } from "ts.data.json";
import { InvalidRequestError } from "../io/exceptions";
// @ts-ignore
import { messages } from "./message";

export async function handleHello(): Promise<HelloPayload> {
  return { message: helloWorld(null, "Api") };
}

export const helloYouDecoder = JsonDecoder.object(
  {
    name: JsonDecoder.oneOf(
      [JsonDecoder.isExactly(null), JsonDecoder.string],
      "name",
    ),
  },
  "helloYouDecoder",
);

export async function handleHelloYou(data: HelloData): Promise<HelloPayload> {
  if (data.name === null) {
    throw new InvalidRequestError(messages.missingName, 400);
  }

  return { message: helloWorld(data.name, "Api") };
}
