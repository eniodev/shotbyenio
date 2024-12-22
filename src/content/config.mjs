// 1. Import utilities from `astro:content`
import { defineCollection } from "astro:content";
import { blogSchema } from "../schemas";

// 2. Define a `type` and `schema` for each collection
const blog = defineCollection({
  type: "content", // v2.5.0 and later
  schema: blogSchema,
});

// 3. Export a single `collections` object to register your collection(s)
export const collections = {
  blog,
};
