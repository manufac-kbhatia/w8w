import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";
import { User } from "./entity/user-entity";
import { Workflow } from "./entity/workflow-entity";
import { Credentials } from "./entity/credentials-entity";

const options: DataSourceOptions = {
  url: "mongodb+srv://bhatiakbkb:<db_password>@cluster0.kwhyrfh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  type: "mongodb",
  entities: [User, Workflow, Credentials],
};
export const AppDataSource = new DataSource(options);

async function initialize() {
  try {
    await AppDataSource.initialize();
    console.log("Data Source has been initialized!");
  } catch (error) {
    console.error("Error during Data Source initialization:", error);
  }
}

initialize();
