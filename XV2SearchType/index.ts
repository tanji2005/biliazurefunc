import { endpoints } from "../src/config";
import { forwardRequest } from "../src/proxy";

const handler = async (context: any, req: any): Promise<void> => {
  await forwardRequest(context, req, {
    targetBase: endpoints.appApi,
  });
};

export default handler;
module.exports = handler;
