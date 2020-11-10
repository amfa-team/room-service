import type { PostRoutes, Response } from "@amfa-team/types";
import { fetch as fetchPolyfill } from "whatwg-fetch";

export interface ApiSettings {
  endpoint: string;
}

export interface AdminApiSettings extends ApiSettings {
  secret: string;
}

export async function apiPost<P extends keyof PostRoutes>(
  settings: ApiSettings,
  path: P,
  data: PostRoutes[P]["in"],
  signal: AbortSignal | null = null,
): Promise<PostRoutes[P]["out"]> {
  const res = await fetchPolyfill(settings.endpoint + path, {
    method: "POST",
    body: JSON.stringify(data),
    signal,
  });

  const response: Response<
    PostRoutes[P]["out"]
  > | null = await res.json().catch(() => null);

  if (!res.ok || !response?.success) {
    let message = `apiPost: failed with "${res.status}"`;
    if (!response?.success) {
      message += ` and error "${response?.error}"`;
    }
    throw new Error(message);
  }

  return response.payload;
}
