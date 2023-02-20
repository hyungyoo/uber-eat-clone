import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsBoolean, IsEmail, IsEnum, IsString } from "class-validator";
import { BasedEntity } from "src/baseData/base.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from "typeorm";
import * as bcrypt from "bcryptjs";
import { HttpException, HttpStatus } from "@nestjs/common";
import { Restaurant } from "src/restaurants/entities/restaurant.entity";
import {
  AllowedUserRole,
  UserRoleForCreate,
} from "src/baseData/enums/user.enum";

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class User extends BasedEntity {
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

  @Column({ type: "enum", enum: AllowedUserRole })
  @IsEnum(AllowedUserRole)
  @Field((type) => UserRoleForCreate)
  role: AllowedUserRole;

  @Column({ name: "is_verified", default: false })
  @IsBoolean()
  @Field((type) => Boolean)
  isVerified: boolean;

  @Field((type) => [Restaurant])
  @OneToMany((type) => Restaurant, (resaturant) => resaturant.owner)
  restaurants: Restaurant[];

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
