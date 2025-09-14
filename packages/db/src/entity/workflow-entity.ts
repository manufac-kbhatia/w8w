import { Entity, ObjectId, ObjectIdColumn, Column, Index } from "typeorm";
import { IConnections, INode } from "../types/interface";

@Entity()
export class Workflow {
  @ObjectIdColumn()
  _id: ObjectId;

  @Index({ unique: true })
  @Column({ length: 128 })
  name: string;

  @Column()
  active: boolean;

  @Column("json")
  nodes: INode[];

  @Column("json")
  connections: IConnections;
}
