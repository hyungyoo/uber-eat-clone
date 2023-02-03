import { ApolloDriver } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./users/users.module";
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "postgres_db",
      port: 5432,
      username: "postgres",
      password: "postgres",
      database: "uber_eat",
      entities: [],
      synchronize: true,
      logging: true,
    }),
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
