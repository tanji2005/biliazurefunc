import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { fetch_config_UA, logger } from "../src/_config";

const api = "https://api.bilibili.com";

const httpTrigger = async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    context.log('HTTP trigger function processed a request.');

    logger
        .child({ action: "获取服务器IP", method: request.method, url: request.url })
        .info({});

    try {
        const response = await fetch(api + "/x/web-interface/zone", fetch_config_UA);
        const jsonResponse = await response.json();

        return {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonResponse)
        };
    } catch (error) {
        context.log('Error:', error);
        return {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};

export default httpTrigger;