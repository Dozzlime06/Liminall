import { pgTable, text, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const agents = pgTable("agents", {
  id: serial("id").primaryKey(),
  agentId: text("agent_id").notNull().unique(),
  deployer: text("deployer").notNull(),
  agentType: text("agent_type").notNull(),
  name: text("name").notNull(),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const agentPayments = pgTable("agent_payments", {
  id: serial("id").primaryKey(),
  txHash: text("tx_hash").notNull().unique(),
  agentId: text("agent_id").notNull(),
  deployer: text("deployer").notNull(),
  amount: text("amount").notNull(),
  token: text("token").notNull().default("LD"),
  timestamp: timestamp("timestamp").notNull(),
});

export const agentActivity = pgTable("agent_activity", {
  id: serial("id").primaryKey(),
  agentId: text("agent_id").notNull(),
  eventType: text("event_type").notNull(),
  description: text("description").notNull(),
  metadata: text("metadata"),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertAgentSchema = createInsertSchema(agents).omit({
  id: true,
  createdAt: true,
});

export const insertAgentPaymentSchema = createInsertSchema(agentPayments).omit({
  id: true,
});

export const insertAgentActivitySchema = createInsertSchema(agentActivity).omit({
  id: true,
  timestamp: true,
});

export type InsertAgent = z.infer<typeof insertAgentSchema>;
export type Agent = typeof agents.$inferSelect;

export type InsertAgentPayment = z.infer<typeof insertAgentPaymentSchema>;
export type AgentPayment = typeof agentPayments.$inferSelect;

export type InsertAgentActivity = z.infer<typeof insertAgentActivitySchema>;
export type AgentActivity = typeof agentActivity.$inferSelect;
