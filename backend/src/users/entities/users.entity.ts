import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from "@nestjs/graphql";
import { IsBoolean, IsEmail, IsEnum, IsString } from "class-validator";
import { ParentEntity } from "src/baseData/base.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity } from "typeorm";
import * as bcrypt from "bcryptjs";
import { HttpException, HttpStatus } from "@nestjs/common";

export enum UserRole {
  CLIENT,
  RESTAURANT,
  DELIVERY,
}

export default registerEnumType(UserRole, { name: "UserRole" });

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class User extends ParentEntity {
  @Column({ unique: true })
  @IsEmail()
  @Field((type) => String)
  email: string;

  @Column()
  @IsString()
  @Field((type) => String)
  name: string;

  @Column({ select: false })
  @IsString()
  @Field((type) => String)
  password: string;

  @Column({ type: "enum", enum: UserRole })
  @IsEnum(UserRole)
  @Field((type) => UserRole)
  role: UserRole;

  @Column({ name: "is_verified", default: false })
  @IsBoolean()
  @Field((type) => Boolean)
  isVerified: boolean;
  @BeforeInsert()
  @BeforeUpdate()
  async MakeHashedPW(): Promise<void> {
    try {
      if (!this.password) return;
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
      throw new HttpException({ error }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async ValidatePW(InputPW: string): Promise<Boolean> {
    try {
      return await bcrypt.compare(InputPW, this.password);
    } catch (errorMessage) {
      throw { isOk: false, errorMessage };
    }
  }

  // @Field((type) => [Restaurant])
  // @OneToMany((type) => Restaurant, (restaurant) => restaurant.owner)
  // restaurants: Restaurant[];

  // @Field((type) => [Order])
  // @OneToMany((type) => Order, (order) => order.customer)
  // orders: Order[];

  // @Field((type) => [Payment])
  // @OneToMany((type) => Payment, (payment) => payment.user, { eager: true })
  // payments: Payment[];

  // @Field((type) => [Order])
  // @OneToMany((type) => Order, (order) => order.driver)
  // rides: Order[];
}
