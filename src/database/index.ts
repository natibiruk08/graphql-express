import {
  DataSource,
  EntityTarget,
  ObjectLiteral,
  Repository,
  EntityManager,
} from "typeorm";
import dotenv from "dotenv";

import { Post } from "./models/Post";
import { User } from "./models/User";
import { Comment } from "./models/Comment";

dotenv.config();

class DatabaseConnection {
  private static instance: DatabaseConnection;
  private dbInstance: DataSource;
  private entityManager: EntityManager;

  private constructor() {
    // Initialize the database connection
    this.dbInstance = new DataSource({
      type: "postgres",
      url: process.env.DB_URL,
      entities: [Post, Comment, User],
      synchronize: true,
    });
  }

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public async connect(): Promise<void> {
    this.dbInstance = await this.dbInstance.initialize();
  }

  public async getInstance(): Promise<DataSource> {
    if (!this.dbInstance) await this.connect();
    return this.dbInstance;
  }

  public async getEntityManager(): Promise<EntityManager> {
    if (!this.dbInstance) await this.connect();
    if (!this.entityManager) {
      this.entityManager = new EntityManager(this.dbInstance);
    }
    return this.entityManager;
  }

  public useTypeORM(
    entity: EntityTarget<ObjectLiteral>
  ): Repository<ObjectLiteral> {
    if (!this.dbInstance) {
      throw new Error("TypeORM has not been initialized!");
    }
    return this.dbInstance.getRepository(entity);
  }
}

const connection = DatabaseConnection.getInstance();

export const useTypeORM = connection.useTypeORM.bind(connection);

const entityManager = connection.getEntityManager.bind(connection);
export const dbQuery = async (query: string, parameters?: any[]) =>
  (await entityManager()).query(query, parameters);

export default connection;
