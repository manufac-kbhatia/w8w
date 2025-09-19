import { AppDataSource } from "@w8w/typeorm";
import { DataSource } from "typeorm";

export class MongoDbConnection {
  private static instance: MongoDbConnection;
  private static dataSource: DataSource = AppDataSource;

  private constructor() {}

  public static async getConnection(): Promise<DataSource> {
    if (!MongoDbConnection.instance) {
      MongoDbConnection.instance = new MongoDbConnection();
      await this.connect();
    }
    return MongoDbConnection.dataSource;
  }

  private static async connect() {
    if (!MongoDbConnection.dataSource.isInitialized) {
      await MongoDbConnection.dataSource.initialize();
      console.log("init");
    }
  }
}
