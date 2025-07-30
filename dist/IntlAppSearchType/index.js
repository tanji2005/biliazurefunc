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
module.exports = function (context, req) {
    return __awaiter(this, void 0, void 0, function* () {
        context.log('IntlAppSearchType: Starting');
        try {
            // 从完整的请求 URL 中提取路径和查询参数
            const urlObject = new URL(req.url);
            const url_data = `${urlObject.pathname}${urlObject.search}`;
            const response = yield fetch(api + url_data, {
                method: req.method,
                headers: {
                    "User-Agent": env.UA,
                },
            });
            const jsonResponse = yield response.json();
            if (jsonResponse.code === 0) {
                const log = env.logger.child({
                    action: "搜索(国际版)",
                    method: req.method,
                    url: req.url,
                });
                log.info({});
                log.debug({ context: jsonResponse });
                let m_res = jsonResponse;
                if (m_res.data.items)
                    m_res["data"]["items"].splice(0, 0, basic_res);
                else
                    m_res["data"]["items"] = [basic_res];
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
            context.log('IntlAppSearchType: Error:', error);
            context.res = {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Internal server error', details: String(error) })
            };
        }
    });
};
//# sourceMappingURL=index.js.map