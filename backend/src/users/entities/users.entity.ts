import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from "@nestjs/graphql";
import { BaseEntity } from "src/baseData/entities/base.entity";
import { Column, Entity } from "typeorm";

enum UserRole {
  client,
  restaurantOwner,
  delivery,
}

registerEnumType(UserRole, { name: "UserRole" });

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field((returns) => String)
  @Column()
  email: string;

  @Field((returns) => String)
  @Column()
  password: string;

  @Field((returns) => UserRole)
  @Column({ type: "enum", enum: UserRole })
  role: UserRole;
}
