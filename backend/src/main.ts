import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { User } from "./users/entities/users.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { AllowedUserRole } from "./core/enums/user.enum";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({}));
  const userRepository = app.get(getRepositoryToken(User));
  const adminUser = await userRepository.findOne({
    where: { role: AllowedUserRole.ADMIN },
  });
  if (!adminUser) {
    await userRepository.save(
      userRepository.create({
        name: process.env.ADMIN_NAME,
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: AllowedUserRole.ADMIN,
      })
    );
  }
  await app.listen(3000);
}
bootstrap();
