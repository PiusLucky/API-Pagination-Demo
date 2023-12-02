import { Request } from "express";
import { IAPIListingQuery } from "../interfaces/blog";
import { faker } from "@faker-js/faker";
export const extractQueryParams = (req: Request): IAPIListingQuery => {
  const { query } = req;
  const { limit, page, search, order, sort } = query;

  return {
    limit: limit ? parseInt(limit as string, 10) : undefined,
    page: page ? parseInt(page as string, 10) : undefined,
    search: search ? (search as string) : undefined,
    order: order ? (order as "DESC" | "ASC") : undefined,
    sort: sort ? (sort as string) : undefined,
  };
};

export const blogPostGenerator = () => {
  return {
    title: faker.word.noun(),
    content: faker.lorem.sentence(700),
  };
};
