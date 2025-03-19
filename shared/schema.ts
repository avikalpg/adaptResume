import { pgTable, text, serial, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  linkedinId: text("linkedin_id").notNull().unique(),
  accessToken: text("access_token").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  profileData: json("profile_data").$type<LinkedInProfile>().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export interface LinkedInProfile {
  headline: string;
  summary: string;
  positions: Array<{
    title: string;
    company: string;
    description: string;
    startDate: string;
    endDate?: string;
  }>;
  education: Array<{
    school: string;
    degree: string;
    field: string;
    startDate: string;
    endDate?: string;
  }>;
  skills: string[];
}
