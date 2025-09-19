import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Credential } from "./entity/Credential";

export const AppDataSource = new DataSource({
  type: "mongodb",
  url: "mongodb+srv://bhatiakbkb:Kunal2301@cluster0.kwhyrfh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  synchronize: true,
  logging: false,
  entities: [User, Credential],
  migrations: [],
  subscribers: [],
});
