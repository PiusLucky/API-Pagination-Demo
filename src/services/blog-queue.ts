import Queue, { Job } from "bull";
import env from "../../env";
import BlogPost from "../models/post";

export class BlogQueueService {
  private blogQueue: Queue.Queue<any>;
  private readonly retries: number = 3; // 3 retries by default

  constructor() {
    this.blogQueue = new Queue("BLOG_CREATE", env.REDIS_URL);

    this.blogQueue.process((job) => this.initiateProcessor(job));
  }

  queue() {
    return this.blogQueue;
  }

  addBlogPost(data: BlogPost) {
    this.blogQueue.add(data, {
      attempts: this.retries,
    });
  }

  async initiateProcessor(job: Job) {
    const postPayload = job.data; 
    await this.processBlogPostCreation(postPayload);
  }

  async processBlogPostCreation(postPayload: Partial<BlogPost>): Promise<void> {
    await BlogPost.create(postPayload);
  }
}
