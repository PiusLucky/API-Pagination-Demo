import { cleanEnv, port, str } from "envalid";
import dotenv from "dotenv";

dotenv.config();

const env = cleanEnv(process.env, {
  PORT: port(),
  DBPASSWORD: str(),
  DATABASE_NAME: str(),
  DATABASE_USERNAME: str(),
  REDIS_URL: str(),
});

export default env;
