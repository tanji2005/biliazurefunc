import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as env from "../src/_config";
import * as data_parse from "../src/utils/player-data-handler/app";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');

    try {
        // 从完整的请求 URL 中提取路径和查询参数
        const urlObject = new URL(req.url);
        const url_data = `${urlObject.pathname}${urlObject.search}`;

        const continue_execute = await data_parse.middleware(
            url_data,
            req.headers,
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
                body: env.block(continue_execute[1], continue_execute[2] || "")
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
                body: result
            };
        }
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