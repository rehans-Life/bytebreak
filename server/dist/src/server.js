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
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const keys_1 = __importDefault(require("../config/keys"));
const PORT = keys_1.default.PORT || 4000;
const MONGO_URI = keys_1.default.DB_URI;
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(MONGO_URI);
        yield mongoose_1.default.connect(MONGO_URI);
        app_1.default.listen(PORT, () => console.log(`Server is listening for requests on PORT ${PORT}`));
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }
}))();
