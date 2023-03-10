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
import { RestaurantModule } from "./restaurants/restaurants.module";
import { Category } from "./category/entities/category.entity";
import { CategoryModule } from "./category/category.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.${process.env.ENV}.env`,
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_USERNAME: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        APP_PORT: Joi.string().required(),
        BACKEND_PORT: Joi.string().required(),
        API_VERSION: Joi.string().required(),
        MAILGUN_API_KEY: Joi.string().required(),
        MAILGUN_DOMAIN_NAME: Joi.string().required(),
        MAILGUN_FROM: Joi.string().required(),
        MAILGUN_TEMPLATE_NAME: Joi.string().required(),
        ADMIN_NAME: Joi.string().required(),
        ADMIN_EMAIL: Joi.string().required(),
        ADMIN_PASSWORD: Joi.string().required(),
        JWT_ACCESS_SECRET: Joi.string().required(),
        JWT_REFRESH_SECRET: Joi.string().required(),
        JWT_ACCESS_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_EXPIRATION_TIME: Joi.string().required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.string().required(),
        CACHE_TTL: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.POSTGRES_HOST,
      port: +process.env.POSTGRES_PORT,
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      synchronize: process.env.ENV !== "prod",
      logging: false,
      entities: [User, EmailVerification, Restaurant, Category],
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
    RestaurantModule,
    CategoryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  constructor() {}
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleWare).forRoutes({
      path: "/graphql",
      method: RequestMethod.ALL,
    });
  }
}
