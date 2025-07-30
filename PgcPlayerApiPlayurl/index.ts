import * as env from "../src/_config";
import * as data_parse from "../src/utils/player-data-handler/app";

// convertHeaders function to convert headers format for Azure Functions traditional model
function convertHeaders(headers: any): { [key: string]: string } {
    // In Azure Functions traditional model, headers is already a plain object
    return headers || {};
}

module.exports = async function (context: any, req: any) {
    context.log('PgcPlayerApiPlayurl: Starting');
    try {
        // 从完整的请求 URL 中提取路径和查询参数，并映射到正确的 Bilibili API 路径
        const urlObject = new URL(req.url);
        // 将 /api/legacy/[path] 映射为 /[path]
        const mappedPath = urlObject.pathname.replace('/api/legacy', '');
        const url_data = `${mappedPath}${urlObject.search}`;

        const continue_execute = await data_parse.middleware(
            url_data,
            convertHeaders(req.headers),
            req.method
        );

        if (continue_execute[0] == false) {
            context.res = {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'max-age=30, s-maxage=30, stale-while-revalidate=30',
                    'CDN-Cache-Control': 'max-age=30',
                    'Cloudflare-CDN-Cache-Control': 'max-age=30',
                    'Vercel-CDN-Cache-Control': 'max-age=30'
                },
                body: JSON.stringify(env.block(continue_execute[1], continue_execute[2] || ""))
            };
        } else {
            const result = await data_parse.main(
                url_data,
                JSON.parse(continue_execute[2])
            );

            context.res = {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'max-age=3600, s-maxage=3600, stale-while-revalidate=3600',
                    'CDN-Cache-Control': 'max-age=3600',
                    'Cloudflare-CDN-Cache-Control': 'max-age=3600',
                    'Vercel-CDN-Cache-Control': 'max-age=3600'
                },
                body: JSON.stringify(result)
            };
        }
    } catch (error) {
        context.log('PgcPlayerApiPlayurl: Error:', error);
        context.res = {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Internal server error', details: String(error) })
        };
    }
};