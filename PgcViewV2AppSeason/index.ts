import * as env from "../src/_config";

const api = env.api.main.app.season_info;

module.exports = async function (context: any, req: any) {
    context.log('PgcViewV2AppSeason: Starting');
    try {
        // 从完整的请求 URL 中提取路径和查询参数，并映射到正确的 Bilibili API 路径
        const urlObject = new URL(req.url);
        const url_data = `${urlObject.pathname}${urlObject.search}`;
        
        const response = await fetch(api + url_data, {
            method: req.method,
            headers: {
                "User-Agent": env.UA,
            },
        });

        const jsonResponse = await response.json();

        const log = env.logger.child({
            action: "番剧详情(APP端)",
            method: req.method,
            url: req.url,
        });
        log.info({});
        log.debug({ context: jsonResponse });

        context.res = {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonResponse)
        };
    } catch (error) {
        context.log('PgcViewV2AppSeason: Error:', error);
        context.res = {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Internal server error', details: String(error) })
        };
    }
};