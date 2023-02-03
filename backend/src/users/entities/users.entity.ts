import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from "@nestjs/graphql";
import { IsString } from "class-validator";
import { ParentEntity } from "src/baseData/base.entity";
import { BeforeInsert, Column, Entity } from "typeorm";
import * as bcrypt from "bcryptjs";
import {
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from "@nestjs/common";

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

  @BeforeInsert()
  async makeHashedPW(): Promise<void> {
    try {
      // console.log(this.password, " is before hashed");
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      this.password = await bcrypt.hash(this.password, salt);
      // console.log(this.password, " is after hashed");
    } catch (error) {
      throw new HttpException({ error }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
