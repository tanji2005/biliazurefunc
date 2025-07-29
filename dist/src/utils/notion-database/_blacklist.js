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
exports.main = exports.checkIfFinishBan = exports.format = exports.addNewUser = exports.query = void 0;
const env = __importStar(require("../../_config"));
const db = __importStar(require("./_db"));
const query = (UID) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield db.query(env.db_NOTION_blacklist, JSON.stringify({
        filter: {
            and: [
                {
                    property: "UID",
                    title: {
                        equals: UID.toString(),
                    },
                },
            ],
        },
    }));
    return res;
});
exports.query = query;
const addNewUser = (UID_1, ...args_1) => __awaiter(void 0, [UID_1, ...args_1], void 0, function* (UID, type = 0, reason = "", ban_until = 0) {
    const res = yield db.update(env.db_NOTION_blacklist, JSON.stringify({
        parent: { database_id: env.db_NOTION_blacklist },
        properties: {
            UID: {
                id: "title",
                type: "title",
                title: [
                    {
                        type: "text",
                        text: { content: UID.toString() },
                        plain_text: UID.toString(),
                    },
                ],
            },
            type: {
                number: type,
            },
            reason: {
                rich_text: [
                    { type: "text", text: { content: reason }, plain_text: reason },
                ],
            },
            ban_until: {
                number: ban_until,
            },
        },
    }));
    return res;
});
exports.addNewUser = addNewUser;
const format = (data) => {
    if (data.results[0]) {
        const basic_data = data.results[0].properties;
        return {
            code: 0,
            message: "",
            data: {
                uid: Number(basic_data.UID.title[0].text.content),
                is_blacklist: basic_data.type.number == 1 ? true : false,
                is_whitelist: basic_data.type.number == 2 ? true : false,
                status: basic_data.type.number,
                ban_until: basic_data.ban_until.number,
            },
        };
    }
    else {
        return {
            code: 400,
            message: "Invalid UID",
        };
    }
};
exports.format = format;
const checkIfFinishBan = (data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (data.results[0]) {
        const id = data.results[0].id;
        const ban_until = (_a = (0, exports.format)(data).data) === null || _a === void 0 ? void 0 : _a.ban_until;
        if (Date.now() / 1000 >= ban_until) {
            yield db.edit(id, JSON.stringify({
                properties: {
                    type: {
                        number: 0,
                    },
                    ban_until: {
                        number: 0,
                    },
                },
            }));
            return true;
        }
        else
            return false;
    }
    else
        return true;
});
exports.checkIfFinishBan = checkIfFinishBan;
const main = (UID) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!env.db_NOTION_blacklist) {
        if (env.public_blacklist_enabled) {
            return yield fetch(env.public_blacklist + UID)
                .then((res) => res.json())
                .catch((err) => console.error(err));
        }
        else
            return {
                code: -1,
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
    const raw_res = yield (0, exports.query)(UID);
    const res = (0, exports.format)(raw_res);
    if (res.code == 0) {
        if ((_a = res.data) === null || _a === void 0 ? void 0 : _a.is_blacklist) {
            if (yield (0, exports.checkIfFinishBan)(raw_res))
                return yield (0, exports.main)(UID);
            else
                return res;
        }
        else
            return res;
    }
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