import sequelize from "../providers/sequelize";
import BlogPost from "./post";

// Declare associations here if necessary
// ...

const init = async () => {
  try {
    console.info("Database SYNCING>>>>>>");

    await sequelize.sync(); // use in development only

    console.info("Database DONE.... SYNCING>>>>>>");
  } catch (error) {
    console.error(error);
  }
};

export const syncAllModels = async () => {
  await init();
};

export const BlogPostModel = BlogPost;
