import { Entity, ObjectIdColumn, ObjectId, Column } from "typeorm";

@Entity()
export class Credential {
  @ObjectIdColumn()
  id: ObjectId;

  @Column({ unique: true })
  name: string;

  @Column()
  type: string;

  @Column()
  data: string;
}
