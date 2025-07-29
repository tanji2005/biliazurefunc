import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import ss from "@beetcb/sstore";
import { local_cache_secret } from "../src/_config";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');

    // 提取查询参数
    const urlObject = new URL(req.url);
    const queryParams = new URLSearchParams(urlObject.search);
    const secret = queryParams.get('s');

    if (secret !== local_cache_secret) {
        context.res = {
            status: 403,
            headers: {
                'Content-Type': 'application/json'
            },
            body: { mes: "Secret Error!" }
        };
    } else {
        ss.clear();
        context.res = {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: { mes: "Clean All Cache and Logs! Done!" }
        };
    }
};

export default httpTrigger;