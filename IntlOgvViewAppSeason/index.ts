import * as env from "../src/_config";

const api = env.api.intl.season_info;

module.exports = async function (context: any, req: any) {
    context.log('IntlOgvViewAppSeason: Starting');
    try {
        // 从完整的请求 URL 中提取路径和查询参数，并映射到正确的 Bilibili API 路径
        const urlObject = new URL(req.url);
        // 将 /api/legacy/[path] 映射为 /[path]
        const mappedPath = urlObject.pathname.replace('/api/legacy', '');
        const url_data = `${mappedPath}${urlObject.search}`;
        
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
                body: JSON.stringify(m_res)
            };
        } else {
            context.res = {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(jsonResponse)
            };
        }
    } catch (error) {
        context.log('IntlOgvViewAppSeason: Error:', error);
        context.res = {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Internal server error', details: String(error) })
        };
    }
};