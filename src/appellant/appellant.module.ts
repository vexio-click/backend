import { Module } from '@nestjs/common';
import { AppellantService } from './appellant.service';
import { AppellantController } from './appellant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppellantEntity } from './entities/appellant.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([AppellantEntity]), ConfigModule],
  providers: [AppellantService],
  controllers: [AppellantController],
})
export class AppellantModule {}
