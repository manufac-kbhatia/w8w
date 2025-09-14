import { ObjectId } from "mongodb";
import { Column, Entity, ObjectIdColumn } from "typeorm";

@Entity()
export class Credentials {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ length: 128 })
  name: string;

  @Column()
  data: string;

  @Column()
  type: string;
}

// {
//     "data": {
//         "updatedAt": "2025-09-13T17:30:43.665Z",
//         "name": "OpenAi account",
//         "data": "U2FsdGVkX18aDir5a2X+UI3DzaaNYWDmuBOfMlqRhvY7NRvluf2zmMYboRSIrlqfUZAnAxRaNSwUBmBIyw1wkDIN6BPZaXKrUk+2QC88wTNFlzCpWUt59duI6A9/7CLbitXwQx2ZJeJdqX5ivx6DJg==",
//         "type": "openAiApi",
//         "isManaged": false,
//         "id": "4cCoIUaYenV412pP",
//         "createdAt": "2025-09-13T17:30:43.666Z",
//     }
// }
