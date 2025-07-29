import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import * as env from "../src/_config";

const httpTrigger = async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    context.log('HTTP trigger function processed a request.');

    try {
        // 从完整的请求 URL 中提取路径和查询参数
        const urlObject = new URL(request.url);
        const url_data = `${urlObject.pathname}${urlObject.search}`;
        
        const response = await fetch(env.api.intl.subtitle + url_data, {
            method: request.method,
            headers: {
                "User-Agent": env.UA,
            },
        });

        const jsonResponse = await response.json();

        const log = env.logger.child({
            action: "字幕获取(国际版)",
            method: request.method,
            url: request.url,
        });
        log.info({});
        log.debug({ context: jsonResponse });

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