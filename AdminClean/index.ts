import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import ss from "@beetcb/sstore";
import { local_cache_secret } from "../src/_config";

const httpTrigger = async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    context.log('HTTP trigger function processed a request.');

    // 提取查询参数
    const urlObject = new URL(request.url);
    const queryParams = new URLSearchParams(urlObject.search);
    const secret = queryParams.get('s');

    if (secret !== local_cache_secret) {
        return {
            status: 403,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ mes: "Secret Error!" })
        };
    } else {
        ss.clear();
        return {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ mes: "Clean All Cache and Logs! Done!" })
        };
    }
};

export default httpTrigger;