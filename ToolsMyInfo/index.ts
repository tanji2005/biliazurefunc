import { logger } from "../src/_config";
import qs from "qs";
import * as env from "../src/_config";
import {
    access_key2info,
    access_keyParams2info,
} from "../src/utils/_bili";

module.exports = async function (context: any, req: any) {
    context.log('ToolsMyInfo: Starting');
    try {
        // 从完整的请求 URL 中提取路径和查询参数，并映射到正确的 Bilibili API 路径
        const urlObject = new URL(req.url);
        // 将 /api/[path] 映射为 /[path]
        const mappedPath = urlObject.pathname.replace('/api', '');
        const url_data = `${mappedPath}${urlObject.search}`;
        
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
            body: JSON.stringify(result)
        };
    } catch (error) {
        context.log('ToolsMyInfo: Error:', error);
        context.res = {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Internal server error', details: String(error) })
        };
    }
};