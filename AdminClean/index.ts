import ss from "@beetcb/sstore";
import { local_cache_secret } from "../src/_config";

module.exports = async function (context: any, req: any) {
    context.log('AdminClean: Starting');
    try {
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
                body: JSON.stringify({ mes: "Secret Error!" })
            };
        } else {
            ss.clear();
            context.res = {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ mes: "Clean All Cache and Logs! Done!" })
            };
        }
    } catch (error) {
        context.log('AdminClean: Error:', error);
        context.res = {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Internal server error', details: String(error) })
        };
    }
};