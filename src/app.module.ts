import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true}),
    AuthModule,
    UserModule, 
    BookmarkModule,
    PrismaModule
  ],
})
export class AppModule {}

//here we used ConfigModule.forRoot({}) by installing npm i @nestjs/config to access the variables in .env file using config.
 