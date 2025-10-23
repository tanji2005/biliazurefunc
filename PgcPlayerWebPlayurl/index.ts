import { endpoints } from "../src/config";
import { forwardRequest } from "../src/proxy";

const handler = async (context: any, req: any): Promise<void> => {
  const requestHeaders = (req.headers ?? {}) as Record<string, string | undefined>;
  const origin = requestHeaders.origin ?? requestHeaders.Origin;

  await forwardRequest(context, req, {
    targetBase: endpoints.webApi,
    enableCors: true,
    corsAllowOrigin: origin,
    additionalHeaders: {
      Referer: "https://www.bilibili.com",
    },
  });
};

export default handler;
module.exports = handler;
