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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const models_1 = require("./src/models");
const blog_1 = require("./src/utils/blog");
dotenv_1.default.config();
(() => __awaiter(void 0, void 0, void 0, function* () {
    // Sync all models
    yield (0, models_1.syncAllModels)();
}))();
const app = (0, express_1.default)();
const port = process.env.PORT;
const corsOptions = {
    origin: "*",
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use(body_parser_1.default.json({ limit: "50mb" }));
app.use(body_parser_1.default.urlencoded({ extended: false }));
// Ideally these can be in separate files & proper validations in place (in case of posts etc.)
app.get("/", (_req, res) => {
    res.send("Express + TypeScript Server");
});
app.get("/post", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = (0, blog_1.extractQueryParams)(req);
        let page = Number(query.page);
        let limit = Number(query.limit);
        let order = query.order;
        let sort = query.sort;
        if (!page)
            page = 1;
        if (!limit)
            limit = 10;
        if (!order)
            order = "DESC";
        if (!sort)
            sort = "createdAt";
        const offset = (page - 1) * limit;
        const endIndex = page * limit;
        const results = {};
        const { rows, count } = yield models_1.BlogPostModel.findAndCountAll({
            where: {},
            order: [[sort, order]],
            offset,
            limit,
            distinct: true,
        });
        results.result = rows;
        if (endIndex < count) {
            results.next = {
                page: page + 1,
            };
        }
        if (offset > 0) {
            results.previous = {
                page: page - 1,
            };
        }
        const totalPages = Math.ceil(count / limit);
        results.limit = limit;
        results.totalElements = count;
        results.totalPages = totalPages;
        res.status(200).json(results);
    }
    catch (error) {
        res.status(500).json("Failed to get posts");
    }
}));
app.post("/post", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newPost = yield models_1.BlogPostModel.create(req.body);
    res.status(201).json(newPost);
}));
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
