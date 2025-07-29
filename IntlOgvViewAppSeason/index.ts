import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as env from "../src/_config";

const api = env.api.intl.season_info;

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');

    try {
        // 从完整的请求 URL 中提取路径和查询参数
        const urlObject = new URL(req.url);
        const url_data = `${urlObject.pathname}${urlObject.search}`;
        
        const response = await fetch(api + url_data, {
            method: req.method,
        });

        const jsonResponse: {
            code: number;
            result: {
                modules: {
                    episodes: {
                        subtitles: {
                            id: number;
                            is_machine: boolean;
                            key: string;
                            title: string;
                            url: string;
                        }[];
                    }[];
                }[];
            };
        } = await response.json();

        if (jsonResponse.code === 0 && env.th_subtitle_api) {
            let m_res = jsonResponse;
            if (m_res.result?.modules[0]?.episodes) {
                const episodes = m_res.result?.modules[0]?.episodes;
                for (const ep of episodes) {
                    // Processing logic can be added here if needed
                }
            }
            
            context.res = {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: m_res
            };
        } else {
            context.res = {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: jsonResponse
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