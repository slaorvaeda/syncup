const { z } = require("zod");

const createFeedSchema = z.object({
  message: z.string().trim().min(1, "Message is required").max(2000),
  title: z.string().trim().max(200).optional().nullable(),
  type: z.enum(["tip", "announcement", "reminder"]).optional(),
  status: z.enum(["published", "draft", "archived"]).optional(),
  imageUrl: z.url().optional().nullable(),
  attachments: z
    .array(
      z.object({
        url: z.url(),
        name: z.string().optional(),
        type: z.string().optional(),
      })
    )
    .optional(),
  visibility: z.enum(["public", "team", "private"]).optional(),
  programId: z.string().trim().max(100).optional().nullable(),
  cohortId: z.string().trim().max(100).optional().nullable(),
  scheduledAt: z.coerce.date().optional().nullable(),
  expiresAt: z.coerce.date().optional().nullable(),
  isPinned: z.boolean().optional(),
  tags: z.array(z.string().trim().max(50)).max(20).optional(),
});

const feedQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(50).optional(),
});

const updateFeedSchema = createFeedSchema;

module.exports = { createFeedSchema, updateFeedSchema, feedQuerySchema };
