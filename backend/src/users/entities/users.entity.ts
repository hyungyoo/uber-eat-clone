import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from "@nestjs/graphql";
import { IsString } from "class-validator";
import { ParentEntity } from "src/baseData/base.entity";
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
export class User extends ParentEntity {
  @Column()
  @IsString()
  @Field((type) => String)
  email: string;

  @Column()
  @IsString()
  @Field((type) => String)
  password: string;

  @Column({ type: "enum", enum: UserRole })
  @Field((type) => UserRole)
  role: UserRole;
}
