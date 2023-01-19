import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() //instead of exporting everytime as below we specify this as Global
@Module({
  providers: [PrismaService],
  exports: [PrismaService],   //inorder to import on other modules we have to export it here.
})
export class PrismaModule {}
