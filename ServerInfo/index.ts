import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { fetch_config_UA, logger } from "../src/_config";

const api = "https://api.bilibili.com";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');

    logger
        .child({ action: "获取服务器IP", method: req.method, url: req.url })
        .info({});

    try {
        const response = await fetch(api + "/x/web-interface/zone", fetch_config_UA);
        const jsonResponse = await response.json();

        context.res = {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: jsonResponse
        };
    } catch (error) {
        context.log('Error:', error);
        context.res = {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            },
            body: { error: 'Internal server error' }
        };
    }
};

export default httpTrigger;