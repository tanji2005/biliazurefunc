import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as env from "../src/_config";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');

    try {
        // 从完整的请求 URL 中提取路径和查询参数
        const urlObject = new URL(req.url);
        const url_data = `${urlObject.pathname}${urlObject.search}`;
        
        const response = await fetch(env.api.intl.playurl + url_data, {
            method: req.method,
            headers: {
                "User-Agent": env.UA,
            },
        });

        const textResponse = await response.text();

        context.res = {
            status: 200,
            headers: {
                'Content-Type': 'text/plain'
            },
            body: textResponse
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