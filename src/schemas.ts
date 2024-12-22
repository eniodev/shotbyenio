import { z, reference } from "astro:content";

const blogSchema = z.object({
    title: z.string().optional(),
    tags: z.array(z.string()).optional(),
    image: z.object({ url: z.string(), alt: z.string() }),
    publishedDate: z.date(),
    relatedPosts: z.array(reference("blog")).optional(),
});

export default { blogSchema };
