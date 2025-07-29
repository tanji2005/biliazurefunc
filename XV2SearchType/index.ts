import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import * as env from "../src/_config";

const api = env.api.main.app.search;
const basic_res = {
  area: "漫游",
  badge: "公告",
  badges: [
    {
      bg_color: "#00C0FF",
      bg_color_night: "#0B91BE",
      bg_style: 1,
      text: env.fs_badges,
      text_color: "#FFFFFF",
      text_color_night: "#E5E5E5",
    },
  ],
  cover: env.fs_cover,
  cv: "",
  episodes: [
    { index: "1", param: "1", position: 1, uri: env.fs_watch_button_link },
  ],
  episodes_new: new Function("return" + JSON.stringify(env.fs_episodes_app))(),
  follow_button: {
    icon: "http://i0.hdslb.com/bfs/bangumi/154b6898d2b2c20c21ccef9e41fcf809b518ebb4.png",
    status_report: "bangumi",
    texts: {
      "0": env.fs_follow_button_title,
      "1": env.fs_unfollow_button_title,
    },
  },
  goto: "bangumi",
  is_selection: 1,
  label: env.fs_label,
  media_type: 1,
  param: "1",
  ptime: 1500000000,
  rating: env.fs_rating,
  season_id: 1,
  season_type: 1,
  season_type_name: "番剧",
  selection_style: env.fs_selection_style,
  staff: "无",
  style: env.fs_style,
  styles: env.fs_style,
  title: env.fs_title,
  uri: env.fs_uri,
  vote: env.fs_vote,
  watch_button: {
    link: env.fs_watch_button_link,
    title: env.fs_watch_button_title,
  },
};

const httpTrigger = async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    context.log('HTTP trigger function processed a request.');

    try {
        // 从完整的请求 URL 中提取路径和查询参数
        const urlObject = new URL(request.url);
        const url_data = `${urlObject.pathname}${urlObject.search}`;
        
        const response = await fetch(api + url_data, {
            method: request.method,
            headers: {
                "User-Agent": env.UA,
            },
        });

        const jsonResponse: { data: { items: Array<object> }; code: number } = await response.json();

        const log = env.logger.child({
            action: "搜索(APP端)",
            method: request.method,
            url: request.url,
        });
        log.info({});
        log.debug({ context: jsonResponse });

        if (jsonResponse.code === 0) {
            let m_res = jsonResponse;
            if (m_res.data.items) m_res["data"]["items"].splice(0, 0, basic_res);
            else m_res["data"]["items"] = [basic_res];
            
            return {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(m_res)
            };
        } else {
            return {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(jsonResponse)
            };
        }
    } catch (error) {
        context.log('Error:', error);
        return {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};

export default httpTrigger;