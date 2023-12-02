import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import { BlogPostModel, syncAllModels } from "./src/models";
import { blogPostGenerator, extractQueryParams } from "./src/utils/blog";
import { PaginateResponse } from "./src/interfaces/blog";
import BlogPost from "./src/models/post";
import env from "./env";
import { ExpressAdapter } from "@bull-board/express";
import { createBullBoard } from "@bull-board/api";
import { BullAdapter } from "@bull-board/api/bullAdapter";
import { blogService } from "./src/services";
import { CronService } from "./src/services/cron";

dotenv.config();

// Specify all queues here
export const queues = [blogService.queue()];

export const QUEUE_LIST = [
  ...queues?.map((queue) => {
    return new BullAdapter(queue);
  }),
];

(async () => {
  // Sync all models
  await syncAllModels();
})();

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

createBullBoard({
  queues: QUEUE_LIST,
  serverAdapter,
});

const app: Express = express();
const port = env.PORT;

const corsOptions = {
  origin: "*", // WHITELISTED DOMAINS - ["test1.com", "test2.com"]
  credentials: true,
};

app.use(cors(corsOptions));

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/admin/queues", serverAdapter.getRouter());
// Ideally these can be in separate files & proper validations in place (in case of posts etc.)
app.get("/", (_req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.get("/post", async (req: Request, res: Response) => {
  try {
    const query = extractQueryParams(req);

    let page = Number(query.page);
    let limit = Number(query.limit);
    let order = query.order;
    let sort = query.sort;

    if (!page) page = 1;
    if (!limit) limit = 10;
    if (!order) order = "DESC";
    if (!sort) sort = "createdAt";

    const offset = (page - 1) * limit;
    const endIndex = page * limit;

    const results: PaginateResponse<BlogPost> = {};

    const { rows, count } = await BlogPostModel.findAndCountAll({
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
  } catch (error) {
    res.status(500).json("Failed to get posts");
  }
});

app.post("/post", async (req: Request, res: Response) => {
  const newPost = await BlogPostModel.create(req.body);
  res.status(201).json(newPost);
});

app.post("/post-queue", async (req: Request, res: Response) => {
  blogService.addBlogPost(req.body);
  res.status(201).json({
    status: 201,
    message: "Post added to queue successfully",
  });
});

//Setup cron service
const blogCron = new CronService();

app.post("/run-blog-cron", async (_req: Request, res: Response) => {
  const customFunction = async () => {
    const generatedPost = blogPostGenerator();
    await BlogPostModel.create(generatedPost);
  };
  blogCron.runTaskEveryMinute(customFunction);
  res.status(200).json({
    status: 200,
    message: "Cron initiated successfully",
  });
});

app.put("/stop-blog-cron", async (_req: Request, res: Response) => {
  const stopCron = blogCron.stopEveryMinuteTask();
  res.status(stopCron.status).json({
    status: stopCron.status,
    message: stopCron.message,
  });
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  console.info(
    `For the Redis Queue UI, open http://localhost:${port}/admin/queues`
  );
  console.info(`Make sure Redis is running on port 6379 by default`);
});
