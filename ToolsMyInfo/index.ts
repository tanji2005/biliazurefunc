import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { logger } from "../src/_config";
import qs from "qs";
import * as env from "../src/_config";
import {
    access_key2info,
    access_keyParams2info,
} from "../src/utils/_bili";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');

    try {
        // 从完整的请求 URL 中提取路径和查询参数
        const urlObject = new URL(req.url);
        const url_data = `${urlObject.pathname}${urlObject.search}`;
        
        logger.child({ action: "", method: req.method, url: req.url }).info({});
        
        const url = new URL(url_data, env.api.main.web.playurl);
        const data = qs.parse(url.search.slice(1));
        
        const result = {
            accesskey: data.access_key,
            appkey: data.appkey || "default",
            params_query_mode: !!data.sign,
            me: await (data.sign
                ? access_keyParams2info("?" + qs.stringify(data))
                : access_key2info(data.access_key as string)),
        };

        context.res = {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: result
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