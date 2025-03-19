import { users, type User, type InsertUser } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByLinkedInId(linkedinId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByLinkedInId(linkedinId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.linkedinId === linkedinId,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const existing = await this.getUser(id);
    if (!existing) {
      throw new Error(`User ${id} not found`);
    }
    const updated = { ...existing, ...updates };
    this.users.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
