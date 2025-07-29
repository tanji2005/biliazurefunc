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
exports.main = exports.format_bitio = exports.addNewUser = void 0;
const env = __importStar(require("../_config"));
const blacklist_notion = __importStar(require("./notion-database/_blacklist"));
const addNewUser = (UID_1, ...args_1) => __awaiter(void 0, [UID_1, ...args_1], void 0, function* (UID, type = 0, reason = "", ban_until = 0) {
    const res = yield env.db_bitio_pool.query("INSERT INTO blacklist (uid,type,reason,ban_until) VALUES ($1,$2,$3,$4)", [UID, type, reason, ban_until]);
    return res;
});
exports.addNewUser = addNewUser;
const format_bitio = (UID) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield env.db_bitio_pool
        .query("SELECT * FROM blacklist WHERE uid = $1", [UID])
        .then((res) => res.rows[0]);
    console.log(data);
    if (data) {
        if (data.type == 1)
            yield env.db_bitio_pool
                .query("DELETE FROM blacklist WHERE ban_until <= $1 AND type = 1", [
                Date.now(),
            ])
                .then((res) => console.log(res)); //TODO 修改为标准log(pino)
        return {
            code: 0,
            message: "",
            data: {
                uid: Number(data.uid),
                is_blacklist: data.type == 1 ? true : false,
                is_whitelist: data.type == 2 ? true : false,
                status: Number(data.type),
                ban_until: Number(data.ban_until),
            },
        };
    }
    else {
        return {
            code: 400,
            message: "Invalid UID",
        };
    }
});
exports.format_bitio = format_bitio;
const main = (UID) => __awaiter(void 0, void 0, void 0, function* () {
    if (!env.db_NOTION_blacklist && !env.db_bitio_enabled) {
        if (env.public_blacklist_enabled) {
            return yield fetch(env.public_blacklist + UID)
                .then((res) => res.json())
                .catch((err) => console.error(err));
        }
        else
            return {
                code: 0,
                message: "未启用黑名单数据库",
                data: {
                    uid: UID,
                    is_blacklist: false,
                    is_whitelist: false,
                    status: 0,
                    ban_until: 0,
                },
            };
    }
    if (env.db_NOTION_blacklist) {
        const res_notion = yield blacklist_notion.main(UID);
        if (res_notion.code === 0)
            return res_notion;
    }
    const res = yield (0, exports.format_bitio)(UID);
    if (res.code === 0)
        return res;
    else if (/^[1-9]\d*$/.test(UID.toString())) {
        if (env.public_blacklist_enabled) {
            const data = (yield fetch(env.public_blacklist + UID)
                .then((res) => res.json())
                .catch((err) => console.error(err)));
            yield (0, exports.addNewUser)(UID, data.data.status, data.data.is_blacklist ? "本用户已进入公共黑名单" : "", data.data.ban_until);
            return data;
        }
        else {
            yield (0, exports.addNewUser)(UID);
            return {
                code: 0,
                message: "",
                data: {
                    uid: UID,
                    is_blacklist: false,
                    is_whitelist: false,
                    status: 0,
                    ban_until: 0,
                },
            };
        }
    }
    else {
        return res;
    }
});
exports.main = main;
//# sourceMappingURL=_blacklist.js.map