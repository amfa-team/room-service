import type { AdminData, GetRoutes, PostRoutes } from "@amfa-team/types";

export interface PublicRequest<T> {
  data: T;
}

export type AdminRequest<T extends AdminData> = PublicRequest<T>;

export interface RequestContext {
  domainName?: string;
  stage: string;
}

export type GetHandler<P extends keyof GetRoutes> = () => Promise<
  GetRoutes[P]["out"]
>;

export type PostHandler<P extends keyof PostRoutes> = (
  data: PostRoutes[P]["in"],
) => Promise<PostRoutes[P]["out"]>;
