import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { logger } from "../src/_config";
import qs from "qs";
import * as env from "../src/_config";
import { cookies2access_key } from "../src/utils/_bili";

function cookieToJson(cookies: string) {
    let cookieArr = cookies.split("; ");
    let obj = {};
    cookieArr.forEach((i) => {
        let arr = i.split("=");
        obj[arr[0]] = arr[1];
    });
    return obj;
}

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');

    try {
        // 从完整的请求 URL 中提取路径和查询参数
        const urlObject = new URL(req.url);
        const url_data = `${urlObject.pathname}${urlObject.search}`;
        
        logger.child({ action: "", method: req.method, url: req.url }).info({});
        
        const url = new URL(url_data, env.api.main.web.playurl);
        const data = qs.parse(url.search.slice(1));
        const cookies = cookieToJson(data.cookies as string);
        
        const result = {
            access_key: await cookies2access_key(cookies as any),
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