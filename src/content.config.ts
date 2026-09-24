import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const writing = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    cfId: z.number(),
    cfUrl: z.string(),
    tags: z.array(z.string()).nullish().transform((t) => t ?? []),
    summary: z.string().optional(),
  }),
});

const problems = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/problems' }),
  schema: z.object({
    title: z.string(), contest: z.string(), year: z.number(), letter: z.string(),
    authors: z.array(z.string()).default([]), timeLimit: z.string().optional(),
    memoryLimit: z.string().optional(), sourceUrl: z.string().optional(), summary: z.string(),
  }),
});

export const collections = { writing, problems };
