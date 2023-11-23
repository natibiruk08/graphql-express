import { DataSource, EntityTarget, ObjectLiteral, Repository } from "typeorm";
import { Post } from "./models/Post";
import { User } from "./models/User";
import { Comment } from "./models/Comment";

let typeORMDB: DataSource;

export default async function connectToDatabase(): Promise<void> {
  const dataSource = new DataSource({
    type: "postgres",
    url: process.env.DB_URL,
    entities: [Post, Comment, User], // points to entities
    synchronize: true,
  });
  typeORMDB = await dataSource.initialize();
}

export function useTypeORM(
  entity: EntityTarget<ObjectLiteral>
): Repository<ObjectLiteral> {
  if (!typeORMDB) {
    throw new Error("TypeORM has not been initialized!");
  }

  return typeORMDB.getRepository(entity);
}
