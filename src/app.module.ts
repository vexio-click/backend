import sqlite3 from 'sqlite3';

import { resolve } from 'path';

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppellantModule } from './appellant/appellant.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.runtime',
    }),
    NestjsFormDataModule.config({
      storage: MemoryStoredFile,
      limits: {
        fileSize: 1 * 1024 * 1024, //1mb
      },
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'sqlite',
        driver: sqlite3,
        database: resolve(
          __dirname,
          configService.get<string>('APP_DB_FOLDER') || '',
          'prod.sqlite',
        ), // from __dirname, dir will be created if not exists, recursive
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),

    AppellantModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
