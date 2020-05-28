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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var node_fetch_1 = require("node-fetch");
var getChallenge = function () { return __awaiter(void 0, void 0, void 0, function () {
    var res, body, BLOCK_SIZE, decrypted, strFixed, buf, isData, counter, byte, index, i, toDecrypt, chlng, chlng_res, chlng_res_body, str, n, newString, j;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, node_fetch_1["default"]("http://localhost:3000/getChallenge")];
            case 1:
                res = _a.sent();
                return [4 /*yield*/, res.json()];
            case 2:
                body = _a.sent();
                BLOCK_SIZE = 8 //Init BLOCK_SIZE
                ;
                decrypted = '' // Data which been decrypted
                ;
                strFixed = '' // Data needs to be reversed because we decrypt from last to begin
                ;
                buf = Buffer.from(body.data, 'hex') // Initial buf with body.data which holds of course the data
                ;
                isData = 1 //flag
                ;
                counter = 0;
                _a.label = 3;
            case 3:
                if (!isData) return [3 /*break*/, 9];
                byte = 7;
                index = [] // This array holds the current block decrypted bytes
                ;
                i = 0;
                _a.label = 4;
            case 4:
                if (!(i < 256)) return [3 /*break*/, 8];
                toDecrypt = Buffer.alloc(BLOCK_SIZE, 0) // Allocation BLOCK_SIZE (each iteration grows by 8)
                ;
                buf.copy(toDecrypt); // copy BLOCK_SIZE bytes to toDecrypt
                switch (byte) {
                    case 7:
                        toDecrypt[BLOCK_SIZE - 1] = toDecrypt[BLOCK_SIZE - 1] ^ i;
                        break;
                    case 6:
                        toDecrypt[BLOCK_SIZE - 1] = toDecrypt[BLOCK_SIZE - 1] ^ (index[0] ^ 1);
                        toDecrypt[BLOCK_SIZE - 2] = toDecrypt[BLOCK_SIZE - 2] ^ (i ^ 1);
                        break;
                    case 5:
                        toDecrypt[BLOCK_SIZE - 1] = toDecrypt[BLOCK_SIZE - 1] ^ (index[0] ^ 2);
                        toDecrypt[BLOCK_SIZE - 2] = toDecrypt[BLOCK_SIZE - 2] ^ (index[1] ^ 2);
                        toDecrypt[BLOCK_SIZE - 3] = toDecrypt[BLOCK_SIZE - 3] ^ (i ^ 2);
                        break;
                    case 4:
                        toDecrypt[BLOCK_SIZE - 1] = toDecrypt[BLOCK_SIZE - 1] ^ (index[0] ^ 3);
                        toDecrypt[BLOCK_SIZE - 2] = toDecrypt[BLOCK_SIZE - 2] ^ (index[1] ^ 3);
                        toDecrypt[BLOCK_SIZE - 3] = toDecrypt[BLOCK_SIZE - 3] ^ (index[2] ^ 3);
                        toDecrypt[BLOCK_SIZE - 4] = toDecrypt[BLOCK_SIZE - 4] ^ (i ^ 3);
                        break;
                    case 3:
                        toDecrypt[BLOCK_SIZE - 1] = toDecrypt[BLOCK_SIZE - 1] ^ (index[0] ^ 4);
                        toDecrypt[BLOCK_SIZE - 2] = toDecrypt[BLOCK_SIZE - 2] ^ (index[1] ^ 4);
                        toDecrypt[BLOCK_SIZE - 3] = toDecrypt[BLOCK_SIZE - 3] ^ (index[2] ^ 4);
                        toDecrypt[BLOCK_SIZE - 4] = toDecrypt[BLOCK_SIZE - 4] ^ (index[3] ^ 4);
                        toDecrypt[BLOCK_SIZE - 5] = toDecrypt[BLOCK_SIZE - 5] ^ (i ^ 4);
                        break;
                    case 2:
                        toDecrypt[BLOCK_SIZE - 1] = toDecrypt[BLOCK_SIZE - 1] ^ (index[0] ^ 5);
                        toDecrypt[BLOCK_SIZE - 2] = toDecrypt[BLOCK_SIZE - 2] ^ (index[1] ^ 5);
                        toDecrypt[BLOCK_SIZE - 3] = toDecrypt[BLOCK_SIZE - 3] ^ (index[2] ^ 5);
                        toDecrypt[BLOCK_SIZE - 4] = toDecrypt[BLOCK_SIZE - 4] ^ (index[3] ^ 5);
                        toDecrypt[BLOCK_SIZE - 5] = toDecrypt[BLOCK_SIZE - 5] ^ (index[4] ^ 5);
                        toDecrypt[BLOCK_SIZE - 6] = toDecrypt[BLOCK_SIZE - 6] ^ (i ^ 5);
                        break;
                    case 1:
                        toDecrypt[BLOCK_SIZE - 1] = toDecrypt[BLOCK_SIZE - 1] ^ (index[0] ^ 6);
                        toDecrypt[BLOCK_SIZE - 2] = toDecrypt[BLOCK_SIZE - 2] ^ (index[1] ^ 6);
                        toDecrypt[BLOCK_SIZE - 3] = toDecrypt[BLOCK_SIZE - 3] ^ (index[2] ^ 6);
                        toDecrypt[BLOCK_SIZE - 4] = toDecrypt[BLOCK_SIZE - 4] ^ (index[3] ^ 6);
                        toDecrypt[BLOCK_SIZE - 5] = toDecrypt[BLOCK_SIZE - 5] ^ (index[4] ^ 6);
                        toDecrypt[BLOCK_SIZE - 6] = toDecrypt[BLOCK_SIZE - 6] ^ (index[5] ^ 6);
                        toDecrypt[BLOCK_SIZE - 7] = toDecrypt[BLOCK_SIZE - 7] ^ (i ^ 6);
                        break;
                    case 0:
                        toDecrypt[BLOCK_SIZE - 1] = toDecrypt[BLOCK_SIZE - 1] ^ (index[0] ^ 7);
                        toDecrypt[BLOCK_SIZE - 2] = toDecrypt[BLOCK_SIZE - 2] ^ (index[1] ^ 7);
                        toDecrypt[BLOCK_SIZE - 3] = toDecrypt[BLOCK_SIZE - 3] ^ (index[2] ^ 7);
                        toDecrypt[BLOCK_SIZE - 4] = toDecrypt[BLOCK_SIZE - 4] ^ (index[3] ^ 7);
                        toDecrypt[BLOCK_SIZE - 5] = toDecrypt[BLOCK_SIZE - 5] ^ (index[4] ^ 7);
                        toDecrypt[BLOCK_SIZE - 6] = toDecrypt[BLOCK_SIZE - 6] ^ (index[5] ^ 7);
                        toDecrypt[BLOCK_SIZE - 7] = toDecrypt[BLOCK_SIZE - 7] ^ (index[6] ^ 7);
                        toDecrypt[BLOCK_SIZE - 8] = toDecrypt[BLOCK_SIZE - 8] ^ (i ^ 7);
                        break;
                    default:
                        break;
                }
                chlng = { data: toDecrypt.toString('hex'), key: body.key };
                return [4 /*yield*/, node_fetch_1["default"]("http://localhost:3000/attemptChallenge", { body: JSON.stringify(chlng), method: "POST", headers: { "Content-Type": "application/json" } })];
            case 5:
                chlng_res = _a.sent();
                return [4 /*yield*/, chlng_res.json()];
            case 6:
                chlng_res_body = _a.sent();
                if (chlng_res_body.error == 'tag') {
                    index.push(i);
                    /*Check if the value we get is a char, space, or number */
                    if ((i.toString(16) >= '20' && i.toString(16) <= '7A')) {
                        console.log("i.toString():" + i.toString(16));
                        decrypted += i.toString(16);
                    }
                    else
                        isData = 0; // else we need to break from while
                    i = 0;
                    byte--;
                }
                _a.label = 7;
            case 7:
                ++i;
                return [3 /*break*/, 4];
            case 8:
                str = '';
                //convert decrypted (which is all values in hex) to a string
                for (n = 0; n < decrypted.length; n += 2) {
                    str += String.fromCharCode(parseInt(decrypted.substr(n, 2), 16));
                }
                newString = "";
                for (j = str.length - 1; j >= 0; j--) {
                    if (str[j] != '.')
                        newString += str[j];
                }
                //strFixed appends the reversed string(which is the correct one)
                strFixed += newString;
                console.log("Block no." + counter++ + " - " + strFixed);
                decrypted = '';
                BLOCK_SIZE += 8;
                return [3 /*break*/, 3];
            case 9:
                console.log("\nDecrypted data\n>" + strFixed);
                return [2 /*return*/];
        }
    });
}); };
getChallenge();
