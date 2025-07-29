"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isExpired = isExpired;
exports.get = get;
exports.set = set;
exports.del = del;
exports.clear = clear;
const sstore_1 = __importDefault(require("@beetcb/sstore"));
//部分代码复制于 https://github.com/SamVerschueren/cache-conf/blob/master/index.js
function isExpired(key) {
    return __awaiter(this, void 0, void 0, function* () {
        const item = yield sstore_1.default.get(key);
        if (!item) {
            return false;
        }
        const invalidTimestamp = item.timestamp && item.timestamp < Date.now();
        return Boolean(invalidTimestamp);
    });
}
function get(_a) {
    return __awaiter(this, arguments, void 0, function* ({ key, ignoreMaxAge = false }) {
        if (ignoreMaxAge !== true && (yield isExpired(key))) {
            sstore_1.default.del(key);
            return;
        }
        const item = yield sstore_1.default.get(key);
        return item && item.data && JSON.parse(item.data);
    });
}
function set(key, val, maxAge = 0) {
    const ssset = sstore_1.default.set(key, { timestamp: Date.now() + maxAge, data: val });
    sstore_1.default.close();
    return ssset;
}
function del(key) {
    sstore_1.default.del(key);
}
function clear() {
    sstore_1.default.clear();
}
//# sourceMappingURL=_sstore.js.map