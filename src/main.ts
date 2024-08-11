//! hyper-express in the future
import { existsSync, readFileSync, mkdirSync, watch } from 'fs';
import { resolve } from 'path';
import { createSecureContext } from 'tls';

import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyStatic from '@fastify/static';
import multipart from '@fastify/multipart';

import { NotFoundExceptionFilter } from './not.foundexception';

function logFileExistence(path) {
  if (!existsSync(path)) {
    console.log(`${path} does not exists`);
    return undefined;
  }
  const content = readFileSync(path);
  if (content) {
    console.log(`${path} content is ${content}`);
  }
  return content;
}
function createDirIfNotExists(path: string) {
  if (!existsSync(path)) {
    console.warn(`Directory ${path} is gonna be created!`);
    mkdirSync(path, { recursive: true });
  }
  return path;
}

async function getHttpsOptions(
  configService: ConfigService,
): Promise<undefined | object> {
  const keyPath = resolve(
    __dirname,
    configService.get<string>('APP_SSL_FOLDER'),
    'private-key.pem',
  );
  const certPath = resolve(
    __dirname,
    configService.get<string>('APP_SSL_FOLDER'),
    'public-certificate.pem',
  );

  return new Promise((resolve) => {
    if (configService.get<string>('APP_USE_HTTPS') != 'true') {
      console.log(`HTTP only mode`);
      return resolve(undefined);
    }

    console.log(`[HTTPS] Looking for key at ${keyPath}`);
    console.log(`[HTTPS] Looking for cert at ${certPath}`);

    const checkFiles = (elapsedSeconds: number) => {
      if (existsSync(keyPath) && existsSync(certPath)) {
        const httpsOptions = {
          key: logFileExistence(keyPath),
          cert: logFileExistence(certPath),
          SNICallback: (servername, cb) => {
            cb(null, createSecureContext(httpsOptions));
          },
        };

        watch(keyPath, () => {
          console.log(`[HTTPS] Key file changed, reloading...`);
          httpsOptions.key = logFileExistence(keyPath);
        });
        watch(certPath, () => {
          console.log(`[HTTPS] Certificate file changed, reloading...`);
          httpsOptions.cert = logFileExistence(certPath);
        });

        return resolve(httpsOptions);
      } else {
        console.log(
          `CERT and KEY for HTTPS not present, checking in every second [${elapsedSeconds}]`,
        );
        setTimeout(() => checkFiles(elapsedSeconds + 1), 1000);
      }
    };
    checkFiles(0);
  });
}

async function start() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const configService = appContext.get(ConfigService);

  console.log(
    `APP_RUNTIME_ENV_LOADED: ${configService.get<string>('APP_RUNTIME_ENV_LOADED')}`,
  );

  const appUrl = configService.get<string>('APP_URL') || 'localhost';
  const appPort = configService.get<string>('APP_PORT') || 3000;

  const appUserFilesFolder = resolve(
    __dirname,
    configService.get<string>('APP_USER_FILES_FOLDER') || '',
  );

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger:
        configService.get<string>('APP_USE_LOGGER') == 'true'
          ? true
          : undefined,
      https: await getHttpsOptions(configService),
    }),
  );

  app.enableCors();

  app.setGlobalPrefix('api');
  app.register(fastifyStatic, {
    root: createDirIfNotExists(appUserFilesFolder),
    prefix: '/api/file',
    extensions: [
      'png',
      'apng',
      'avif',
      'gif',
      'jpg',
      'jpeg',
      'jfif',
      'pjpeg',
      'pjp',
      'svg',
      'webp',
      'bmp',
      'ico',
      'cur',
      'tif',
      'tiff',
    ],
  });

  app.register(multipart);
  app.useGlobalFilters(new NotFoundExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: {
        exposeUnsetFields: false,
      },
      disableErrorMessages: false,
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  await app.listen(appPort, appUrl);

  console.log(
    `Application is running on: ${appUrl}:${appPort} -> ${await app.getUrl()}`,
  );
}

start();
