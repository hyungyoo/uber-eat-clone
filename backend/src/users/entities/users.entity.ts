import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from "@nestjs/graphql";
import { baseEntity } from "src/baseData/base.entity";
import { Column, Entity } from "typeorm";

enum UserRole {
  client,
  restaurantOwner,
  delivery,
}

registerEnumType(UserRole, {
  name: "UserRole",
});

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class User extends baseEntity {
  @Column()
  @Field((type) => String)
  email: string;

  @Column()
  @Field((type) => String)
  password: string;

  @Column({ type: "enum", enum: UserRole })
  @Field((type) => UserRole)
  role: UserRole;
}
