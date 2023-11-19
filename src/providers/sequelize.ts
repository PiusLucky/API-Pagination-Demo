import { Sequelize } from "sequelize";

let sequelize: Sequelize;

console.info(
  "************ <<<< STARTING TESTING DATABASE >>>> *******************"
);

const DBPASSWORD = "YOUR_PASWORD";

sequelize = new Sequelize("DATABASE_NAME", "postgres", DBPASSWORD, {
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

const init = async () => {
  try {
    await sequelize.authenticate();
    console.info(`Connection has been established successfully.`);
  } catch (error) {
    console.error(`Unable to connect to the database: ${error}`);
    process.exit(1);
  }
};

init();

export default sequelize;
