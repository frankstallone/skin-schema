import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const blogCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/blog' }),
  schema: z.object({
    isDraft: z.boolean(),
    title: z.string(),
    description: z.string(),
    // In frontmatter, dates written without quotes around them are interpreted as Date objects
    publishDate: z
      .string()
      .or(z.date())
      .transform((val) => new Date(val)),
    image: z.string().optional(),
  }),
});

export const collections = {
  blog: blogCollection,
};
