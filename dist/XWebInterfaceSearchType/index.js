"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const env = __importStar(require("../src/_config"));
const _bili_1 = require("../src/utils/_bili");
const api = env.api.main.web.search;
const basic_res = {
    type: "media_bangumi",
    media_id: 1,
    title: env.fs_title,
    org_title: env.fs_title,
    media_type: 1,
    cv: "",
    staff: "无",
    season_id: 1,
    is_avid: false,
    hit_columns: ["title"],
    hit_epids: "",
    season_type: 1,
    season_type_name: "番剧",
    selection_style: env.fs_selection_style,
    ep_size: env.fs_episodes_web.length,
    url: env.fs_watch_button_link,
    button_text: env.fs_watch_button_title,
    is_follow: 0,
    is_selection: 1,
    eps: env.fs_episodes_web,
    badges: [
        {
            bg_color: "#00C0FF",
            bg_color_night: "#0B91BE",
            bg_style: 1,
            text: env.fs_badges,
            text_color: "#FFFFFF",
            text_color_night: "#E5E5E5",
            border_color: "",
            border_color_night: "",
        },
    ],
    cover: env.fs_cover,
    areas: "漫游",
    styles: env.fs_style,
    goto_url: env.fs_watch_button_link,
    desc: env.fs_desc,
    pubtime: 1500000000,
    media_mode: 2,
    fix_pubtime_str: "",
    media_score: {
        score: env.fs_rating,
        user_count: env.fs_vote,
    },
    display_info: [
        {
            bg_color: "#00C0FF",
            bg_color_night: "#0B91BE",
            bg_style: 1,
            text: env.fs_badges,
            text_color: "#FFFFFF",
            text_color_night: "#E5E5E5",
            border_color: "",
            border_color_night: "",
        },
    ],
    pgc_season_id: 1,
    corner: 13,
    index_show: env.fs_label,
};
module.exports = function (context, req) {
    return __awaiter(this, void 0, void 0, function* () {
        context.log('XWebInterfaceSearchType: Starting');
        try {
            // 从完整的请求 URL 中提取路径和查询参数，并映射到正确的 Bilibili API 路径
            const urlObject = new URL(req.url);
            // 将 /api/legacy/[path] 映射为 /[path]
            const mappedPath = urlObject.pathname.replace('/api/legacy', '');
            const url_data = `${mappedPath}${urlObject.search}`;
            const cookies = (yield (0, _bili_1.getCookies)()) || "";
            const response = yield fetch(api + url_data, {
                method: req.method,
                headers: {
                    "User-Agent": env.UA,
                    cookie: cookies,
                },
            });
            const jsonResponse = yield response.json();
            const log = env.logger.child({
                action: "搜索(网页端)",
                method: req.method,
                url: req.url,
            });
            log.info({});
            log.debug({ context: jsonResponse });
            if (jsonResponse.code === 0) {
                let m_res = jsonResponse;
                if (m_res.data.result) {
                    m_res["data"]["result"].splice(0, 0, basic_res);
                }
                else
                    m_res["data"]["items"] = [basic_res];
                m_res.data.pagesize += 1;
                m_res.data.numResults += 1;
                context.res = {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(m_res)
                };
            }
            else {
                context.res = {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(jsonResponse)
                };
            }
        }
        catch (error) {
            context.log('XWebInterfaceSearchType: Error:', error);
            context.res = {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Internal server error', details: String(error) })
            };
        }
    });
};
//# sourceMappingURL=index.js.map