import { DataTypes, Model } from "sequelize";
import sequelize from "../providers/sequelize";

class BlogPost extends Model {
  declare id: string;
  declare title: string;
  declare content: string;
}

BlogPost.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    readTimeInMinute: {
      type: DataTypes.VIRTUAL,
      get() {
        const wordsPerMinute = 200;
        const words = this.getDataValue("content")?.split(/\s+/).length;
        const minutes = Math.ceil(words / wordsPerMinute);
        return minutes;
      },
    },
  },
  {
    sequelize,
    modelName: "post",
    timestamps: true,
    paranoid: true,
  }
);

export default BlogPost;
