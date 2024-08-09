import { z } from "zod";

export const SpendingOver25CollectionSchema = z.object({
  content_id: z.string(),
  description: z.string(),
  links: z.object({
    documents: z.array(
      z.object({
        api_path: z.string(),
        api_url: z.string().url(),
        base_path: z.string(),
        content_id: z.string(),
        document_type: z.string(),
        locale: z.string(),
        public_updated_at: z.string().datetime(),
        schema_name: z.string(),
        title: z.string(),
        web_url: z.string().url(),
        withdrawn: z.boolean(),
      }),
    ),
  }),
});

export type SpendingOver25Collection = z.infer<typeof SpendingOver25CollectionSchema>;

export const DocumentSchema = z.object({
  title: z.string(),
  content_id: z.string(),
  details: z.object({
    attachments: z.array(
      z.object({
        url: z.string().url(),
        title: z.string(),
        id: z.string(),
        filename: z.string(),
        content_type: z.string(),
        file_size: z.number(),
      }),
    ),
  }),
});

export type Document = z.infer<typeof DocumentSchema>;
