"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.version = exports.block = exports.block_type = exports.th_subtitle_api = exports.block_region = exports.block_bangumi = exports.ver_min = exports.pass_web_on_check = exports.web_on = exports.need_login = exports.public_blacklist = exports.public_blacklist_enabled = exports.whitelist_vip_enabled = exports.check_vip_enabled = exports.whitelist_enabled = exports.blacklist_enabled = exports.db_NOTION_log = exports.db_NOTION_blacklist = exports.NOTION_KEY = exports.db_bitio_pool = exports.db_bitio_enabled = exports.local_cache_secret = exports.db_local_enabled = exports.cache_time = exports.try_unblock_CDN_speed_enabled = exports.fs_episodes_web = exports.fs_episodes_app = exports.fs_selection_style = exports.fs_badges = exports.fs_unfollow_button_title = exports.fs_follow_button_title = exports.fs_watch_button_link = exports.fs_watch_button_title = exports.fs_vote = exports.fs_rating = exports.fs_desc = exports.fs_label = exports.fs_style = exports.fs_uri = exports.fs_cover = exports.fs_title = exports.fetch_config_UA = exports.UA = exports.api_oauth = exports.api = void 0;
//=============================================================================
//==============================API区(不用改)====================================
//搜索、信息查询等APP端功能
//export const api_search: string = "https://app.bilibili.com";
//playurl等主要功能 api
//export const api_playurl: string = "https://api.bilibili.com";
//main 为 主站API(大陆+港澳台) ;intl 为 海外版API(东南亚)
exports.api = {
    main: {
        web: {
            playurl: "https://api.bilibili.com",
            search: "https://api.bilibili.com",
            season_info: "https://api.bilibili.com",
            user_info: "https://api.bilibili.com",
            third_login: "https://passport.bilibili.com",
        },
        app: {
            playurl: "https://api.bilibili.com",
            search: "https://app.bilibili.com",
            season_info: "https://api.bilibili.com",
            user_info: "https://app.bilibili.com",
        },
    },
    intl: {
        playurl: "https://app.biliintl.com",
        subtitle: "https://app.biliintl.com",
        search: "https://app.biliintl.com",
        season_info: "https://app.biliintl.com",
    },
    grpc: {
        web: {
            playurl: "https://app.bilibili.com",
        },
        app: {
            playurl: "https://grpc.biliapi.net",
            subtitle: "https://app.bilibili.com",
        },
    },
};
//OAuth用API
exports.api_oauth = {
    main: "https://passport.bilibili.com/x/passport-login/oauth2/refresh_token",
    intl: "https://passport.biliintl.com/x/intl/passport-login/oauth2/refresh_token",
};
//调用API所用UA
exports.UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.82";
exports.fetch_config_UA = { headers: { "User-Agent": exports.UA } };
//==============================================================================
//===========================替换搜索 Fuck Search================================
//添加假番剧作公告板
//标题 <em class="keyword">标签可以重点标注
exports.fs_title = '功能测试 <em class="keyword">xrz</em>';
//封面
exports.fs_cover = "https://i0.hdslb.com/bfs/face/046974d6dde4af386f7eb4f231b84ec08bad693b.jpg";
//用处不明
exports.fs_uri = "https://xrz.cool";
//标签-副标题1
exports.fs_style = "标签1 | 测试";
//标签-副标题2
exports.fs_label = "标签2 | test";
//描述(WEB版API)
exports.fs_desc = "这是一个公告哦！";
//番剧分数
exports.fs_rating = 10;
//打分人数
exports.fs_vote = 1;
//立即观看按钮-主选项标题
exports.fs_watch_button_title = "立即观看";
//立即观看按钮-主选项链接
exports.fs_watch_button_link = "https://cn.bing.com";
//追番按钮-追番
exports.fs_follow_button_title = "别点";
//追番按钮-取消追番
exports.fs_unfollow_button_title = "谢邀";
//番剧封面右上角标签
exports.fs_badges = "萨日朗";
//番剧剧集显示方式 grid-单行方块(按钮式) horizontal-列表长条(横条式)
exports.fs_selection_style = "horizontal";
//番剧剧集数据(APP端API)
exports.fs_episodes_app = [
    {
        title: "教程",
        uri: "https://github.com/yujincheng08/BiliRoaming/wiki#使用方法",
    },
    {
        title: "官方反馈群",
        uri: "https://t.me/biliroaming",
        badges: [
            {
                text: "官方",
                text_color: "#FFFFFF",
                text_color_night: "#E5E5E5",
                bg_color: "#FB7299",
                bg_color_night: "#BB5B76",
                border_color: "#FB7299",
                border_color_night: "#BB5B76",
                bg_style: 1,
            },
        ],
    },
    {
        title: "这里没东西",
        uri: "https://www.bilibili.com/video/av928861104",
        badges: [
            {
                text: "愿者上勾",
                text_color: "#FFFFFF",
                text_color_night: "#E5E5E5",
                bg_color: "#FB7299",
                bg_color_night: "#BB5B76",
                border_color: "#FB7299",
                border_color_night: "#BB5B76",
                bg_style: 1,
            },
        ],
    },
];
//番剧剧集数据(WEB端API) 在官方WEB中，long_title与index_title设置可能无效，显示的为title (显示为：index_title空格long_title) ；cover不显示
//此处参考 https://socialsisteryi.github.io/bilibili-API-collect/docs/search/search_response.html#%E5%AF%B9%E8%B1%A1%E7%B1%BB%E5%9E%8B2-%E7%BB%93%E6%9E%9C%E4%B8%BA%E7%95%AA%E5%89%A7-%E5%BD%B1%E8%A7%86
exports.fs_episodes_web = [
    {
        id: 1,
        cover: "",
        title: "教程",
        url: "https://github.com/yujincheng08/BiliRoaming/wiki#使用方法",
        release_date: "",
        badges: null,
        index_title: "1",
        long_title: "教程",
    },
    {
        id: 1,
        cover: "",
        title: "官方反馈群",
        url: "https://t.me/biliroaming",
        release_date: "",
        badges: [
            {
                text: "官方",
                text_color: "#FFFFFF",
                text_color_night: "#E5E5E5",
                bg_color: "#FB7299",
                bg_color_night: "#BB5B76",
                border_color: "#FB7299",
                border_color_night: "#BB5B76",
                bg_style: 1,
            },
        ],
        index_title: "2",
        long_title: "官方反馈群",
    },
    {
        id: 1,
        cover: "",
        title: "这里没东西",
        url: "https://www.bilibili.com/video/av928861104",
        release_date: "",
        badges: [
            {
                text: "愿者上勾",
                text_color: "#FFFFFF",
                text_color_night: "#E5E5E5",
                bg_color: "#FB7299",
                bg_color_night: "#BB5B76",
                border_color: "#FB7299",
                border_color_night: "#BB5B76",
                bg_style: 1,
            },
        ],
        index_title: "3",
        long_title: "这里没东西",
    },
];
//============================================================
//===========================小工具============================
//尝试解除下载速度限制(替换下载链接中bw=1280000),略影响性能
exports.try_unblock_CDN_speed_enabled = 0;
//============================================================
//===========================数据库============================
//支持 本地模式(日志、缓存)、NOTION(日志、黑名单)、PostgreSOL(日志、缓存、黑名单)
//注：本地模式 与 PostgreSQL 优先本地
//缓存时间 单位：15分钟(min) 需打开缓存数据库 仅当deadline不存在时生效
exports.cache_time = 1000 * 60 * 15;
//本地模式设置
//本地模式开关
exports.db_local_enabled = 1;
//本地数据库查询密钥
exports.local_cache_secret = process.env.local_cache_secret || "";
//PostgreSQL配置(需Read/Write权限)
const serverless_1 = require("@neondatabase/serverless"); //导入(不用改)
exports.db_bitio_enabled = 0; //启用postgresql数据库
const connectionString = //三种配置方法
 process.env.POSTGRES_URL || //在Vercel项目Storage里连接数据库，并将上方 db_bitio_enabled 设为1
    process.env.db_bitio_pool || //配置环境变量 db_bitio_pool 为下方格式
    "postgresql://用户名:秘钥@服务器域名:端口/数据库名"; //配置数据库链接
exports.db_bitio_pool = new serverless_1.Pool({ connectionString, ssl: true }); //导出(不用改)
//NOTION数据库配置
//NOTION KEY
exports.NOTION_KEY = process.env.NOTION_KEY || "secret_***BUrz1***********eknk*****gm";
//NOTION DATABASES
//为空""且不添加环境变量即禁用该功能
exports.db_NOTION_blacklist = process.env.NOTION_db_blacklist || "";
exports.db_NOTION_log = process.env.NOTION_db_log || "";
//============================================================
//======================黑白名单设置============================
//黑名单模式 1-开 0-关
exports.blacklist_enabled = 1;
//白名单模式 1-开 0-关
exports.whitelist_enabled = 0;
//验证vip与视频要求 1-开 0-关
exports.check_vip_enabled = 1;
//禁忌设置-白名单调用vip access_key 1-开 0-关
exports.whitelist_vip_enabled = 0;
//============================================================
//===================获取公共黑白名单============================
//功能开关 1-开 0-关
exports.public_blacklist_enabled = 1;
//公共黑名单地址 要求：URL后需可以直接加 UID/mid
exports.public_blacklist = "https://black.qimo.ink/api/users/";
//============================================================
//=====================限制API调用=============================
//要求登录 1-开 0-关
exports.need_login = 0;
//允许WEB版使用(B站官网可直接请求,无需开启此选项) 1-开 0-关
exports.web_on = 1;
//允许Referer为 https://www.bilibili.com 的请求而无需打开web_on (解决BBDown问题) 1-开 0-关
//用BBDown的打开此选项(虽然似乎没用)
exports.pass_web_on_check = 1;
//限制哔哩漫游最低版本 填写数字 0-不限制
//1289为1.7.0的版本号,默认限制会定期更新至最新版。
//1290为目前最新测试版(CI)。
exports.ver_min = 1290;
//限制播放特定番剧/视频
//限制采用"或"策略，满足任意一项即封锁
//默认屏蔽部分番剧/视频，建议保持
exports.block_bangumi = {
    ss: [], //暂不支持ss屏蔽
    ep: [778998, 778292, 769927, 778044, 779739, 780016], //数字
    cid: [], //数字
    avid: [], //数字
    bvid: [], //字符，eg. ["BV1Wz4y1t7g4"]
};
//锁区，填写的是支持的地区 cn-中国大陆 hk-中国香港 tw-中国台湾 th-泰国/新加坡/东南亚地区
//TODO 暂时未加地区检测，访问不支持地区由B站服务器提示错误。
exports.block_region = ["hk"];
//============================================================
//=====================获取非官方泰区字幕========================
//为空则禁用
//字幕获取地址 要求：URL={th_subtitle_api}{season_id}/subtitle.json?id={当集ID}
exports.th_subtitle_api = "";
//============================================================
//===================封锁类型(不用改)===========================
//TODO 显示黑名单持续时间
var block_type;
(function (block_type) {
    block_type[block_type["web_on\u5DF2\u5173\u95ED\uFF0C\u8BF7\u4F7F\u7528BiliRoaming"] = 1] = "web_on\u5DF2\u5173\u95ED\uFF0C\u8BF7\u4F7F\u7528BiliRoaming";
    block_type[block_type["BiliRoaming\u7248\u672C\u8FC7\u4F4E\uFF0C\u8BF7\u66F4\u65B0"] = 2] = "BiliRoaming\u7248\u672C\u8FC7\u4F4E\uFF0C\u8BF7\u66F4\u65B0";
    block_type[block_type["\u9ED1/\u767D\u540D\u5355\u6570\u636E\u83B7\u53D6\u9519\u8BEF\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5"] = 3] = "\u9ED1/\u767D\u540D\u5355\u6570\u636E\u83B7\u53D6\u9519\u8BEF\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5";
    block_type[block_type["\u5B81\u5DF2\u8FDB\u5165\u9ED1\u540D\u5355\uFF0C\u8BF7\u4E0D\u8981\u518D\u4F20\u64AD\u6F2B\u6E38(\u522B\u95EE\u5C01\u5230\u4EC0\u4E48\u65F6\u5019)"] = 4] = "\u5B81\u5DF2\u8FDB\u5165\u9ED1\u540D\u5355\uFF0C\u8BF7\u4E0D\u8981\u518D\u4F20\u64AD\u6F2B\u6E38(\u522B\u95EE\u5C01\u5230\u4EC0\u4E48\u65F6\u5019)";
    block_type[block_type["\u767D\u540D\u5355\u6A21\u5F0F\u5DF2\u542F\u7528\uFF0C\u60A8\u672A\u5728\u767D\u540D\u5355\u4E2D"] = 5] = "\u767D\u540D\u5355\u6A21\u5F0F\u5DF2\u542F\u7528\uFF0C\u60A8\u672A\u5728\u767D\u540D\u5355\u4E2D";
    block_type[block_type["\u5DF2\u8BBE\u7F6E\u767B\u5F55\u53EF\u7528\uFF0C\u8BF7\u767B\u5F55"] = 6] = "\u5DF2\u8BBE\u7F6E\u767B\u5F55\u53EF\u7528\uFF0C\u8BF7\u767B\u5F55";
    block_type[block_type["\u7F3A\u5C11\u53C2\u6570"] = 7] = "\u7F3A\u5C11\u53C2\u6570";
    block_type[block_type["\u5F53\u524D\u756A\u5267/\u89C6\u9891\u5728\u9ED1\u540D\u5355\u4E2D\uFF0C\u62D2\u7EDD\u89E3\u6790\uFF01"] = 8] = "\u5F53\u524D\u756A\u5267/\u89C6\u9891\u5728\u9ED1\u540D\u5355\u4E2D\uFF0C\u62D2\u7EDD\u89E3\u6790\uFF01";
})(block_type || (exports.block_type = block_type = {}));
const block = (code, mes) => {
    return {
        code: -412,
        message: `${block_type[code] +
            (code === 2 ? `至${exports.ver_min}(版本号)以上` : "") +
            (mes ? `(${mes})` : "") +
            "(请等待1min再试)"}[E=${code}]`,
    };
};
exports.block = block;
//============================================================
//===================信息展示(不用改)===========================
const package_json_1 = __importDefault(require("../package.json"));
exports.version = `${package_json_1.default.version}[${((_a = (process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ||
    process.env.VERCEL_GIT_COMMIT_SHA ||
    process.env.CF_PAGES_COMMIT_SHA)) === null || _a === void 0 ? void 0 : _a.slice(0, 7)) || "unknown"}]`;
//============================================================
//===================日志函数(不用改)===========================
const pino_1 = __importDefault(require("pino"));
exports.logger = (0, pino_1.default)();
/* 由于包问题，默认不启用`pino-pretty`日志美化(不影响日志记录)
若需本地使用本项目且需更好的日志体验，请`pnpm i pino-pretty`，并注释上面一行及解除下面两行的注释*/
// import pretty from "pino-pretty";
// export const logger = pino(pretty({ colorize: true })).child({ version });
//============================================================
//# sourceMappingURL=_config.js.map