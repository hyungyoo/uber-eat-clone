import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as Joi from "joi";
import { JwtMiddleWare } from "./jwt/jwt.middleware";
import { JwtModule } from "./jwt/jwt.module";
import { User } from "./users/entities/users.entity";
import { UsersModule } from "./users/users.module";
import { EmailModule } from "./email/email.module";
import { EmailVerification } from "./email/entities/email.verification.entity";
import { Restaurant } from "./restaurants/entities/restaurant.entity";
import { Category } from "./restaurants/entities/category.entity";
import { Food } from "./restaurants/entities/food.entity";
import { Order } from "./orders/entities/order.entity";
import { OrderFood } from "./orders/entities/order.food.option.entity";
import { Payment } from "./payment/entites/payment.entity";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.ENV === "e2e" || "local" ? ".test.env" : ".env",
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.string().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        PRIVATE_KEY_FOR_TOKEN: Joi.string().required(),
        MAILGUN_API_KEY: Joi.string().required(),
        MAILGUN_DOMAIN_NAME: Joi.string().required(),
        MAILGUN_FROM: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.POSTGRES_HOST,
      port: +process.env.POSTGRES_PORT,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      synchronize: true,
      logging: false,
      entities: [
        User,
        EmailVerification,
        Restaurant,
        Category,
        Food,
        Order,
        OrderFood,
        Payment,
      ],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      context: async ({ req }) => {
        return { user: req["user"] };
      },
    }),
    JwtModule.forRoot({ isGlobal: true }),
    EmailModule.forRoot({ isGlobal: true }),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleWare).forRoutes({
      path: "/graphql",
      method: RequestMethod.ALL,
    });
  }
}
