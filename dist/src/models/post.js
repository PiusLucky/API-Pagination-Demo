"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../providers/sequelize"));
class BlogPost extends sequelize_1.Model {
}
BlogPost.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    readTimeInMinute: {
        type: sequelize_1.DataTypes.VIRTUAL,
        get() {
            var _a;
            const wordsPerMinute = 200;
            const words = (_a = this.getDataValue("content")) === null || _a === void 0 ? void 0 : _a.split(/\s+/).length;
            const minutes = Math.ceil(words / wordsPerMinute);
            return minutes;
        },
    },
}, {
    sequelize: sequelize_2.default,
    modelName: "post",
    timestamps: true,
    paranoid: true,
});
exports.default = BlogPost;
