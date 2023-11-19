"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractQueryParams = void 0;
const extractQueryParams = (req) => {
    const { query } = req;
    const { limit, page, search, order, sort } = query;
    return {
        limit: limit ? parseInt(limit, 10) : undefined,
        page: page ? parseInt(page, 10) : undefined,
        search: search ? search : undefined,
        order: order ? order : undefined,
        sort: sort ? sort : undefined,
    };
};
exports.extractQueryParams = extractQueryParams;
