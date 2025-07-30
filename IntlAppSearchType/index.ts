import * as env from "../src/_config";

const api = env.api.intl.search;
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
  badges_v2: [
    {
      bg_color: "#FF6699",
      bg_color_night: "#D44E7D",
      bg_style: 1,
      text: env.fs_badges,
      text_color: "#FFFFFF",
      text_color_night: "#FFFFFF",
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
  is_atten: 0,
  is_selection: 1,
  label: env.fs_label,
  media_type: 1,
  param: "1",
  ptime: 1500000000,
  pub_time: "",
  rating: env.fs_rating,
  season_id: 1,
  season_type: 1,
  season_type_name: "番剧",
  selection_style: env.fs_selection_style,
  staff: "无",
  style: env.fs_style,
  styles: env.fs_style,
  styles_v2: env.fs_style,
  title: env.fs_title,
  uri: env.fs_uri,
  vote: env.fs_vote,
  watch_button: {
    link: env.fs_watch_button_link,
    title: env.fs_watch_button_title,
  },
};

module.exports = async function (context: any, req: any) {
    context.log('IntlAppSearchType: Starting');
    try {
        // 从完整的请求 URL 中提取路径和查询参数，并映射到正确的 Bilibili API 路径
        const urlObject = new URL(req.url);
        // 将 /api/[path] 映射为 /[path]
        const mappedPath = urlObject.pathname.replace('/api', '');
        const url_data = `${mappedPath}${urlObject.search}`;
        
        const response = await fetch(api + url_data, {
            method: req.method,
            headers: {
                "User-Agent": env.UA,
            },
        });

        const jsonResponse: { data: { items: Array<object> }; code: number } = await response.json();

        if (jsonResponse.code === 0) {
            const log = env.logger.child({
                action: "搜索(国际版)",
                method: req.method,
                url: req.url,
            });
            log.info({});
            log.debug({ context: jsonResponse });
            let m_res = jsonResponse;
            if (m_res.data.items) m_res["data"]["items"].splice(0, 0, basic_res);
            else m_res["data"]["items"] = [basic_res];
            
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
        context.log('IntlAppSearchType: Error:', error);
        context.res = {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Internal server error', details: String(error) })
        };
    }
};