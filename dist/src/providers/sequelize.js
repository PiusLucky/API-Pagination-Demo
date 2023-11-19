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
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
let sequelize;
console.info("************ <<<< STARTING TESTING DATABASE >>>> *******************");
const DBPASSWORD = "YOUR_PASWORD";
sequelize = new sequelize_1.Sequelize("DATABASE_NAME", "postgres", DBPASSWORD, {
    host: "localhost",
    dialect: "postgres",
    logging: false,
    define: {
        timestamps: true,
    },
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
});
process.on("SIGINT", () => {
    sequelize.close().then(() => {
        console.info("Connection to the database has been closed.");
        process.exit(0);
    });
});
const init = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield sequelize.authenticate();
        console.info(`Connection has been established successfully.`);
    }
    catch (error) {
        console.error(`Unable to connect to the database: ${error}`);
        process.exit(1);
    }
});
init();
exports.default = sequelize;
