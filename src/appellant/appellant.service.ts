import { writeFileSync } from 'fs';
import { resolve } from 'path';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MemoryStoredFile } from 'nestjs-form-data';
import { ConfigService } from '@nestjs/config';

import { AppellantEntity } from './entities/appellant.entity';
import { SelectAppellantDto } from './dto/select-appellant.dto';
import { InsertAppellantDto } from './dto/insert-appellant.dto';
import { generateHashTime } from '&/fileHashName';

@Injectable()
export class AppellantService {
  constructor(
    @InjectRepository(AppellantEntity)
    private readonly appellantRepository: Repository<AppellantEntity>,
    private readonly configService: ConfigService,
  ) {}

  async insert(appellant: InsertAppellantDto): Promise<AppellantEntity[]> {
    const appellantData = {
      name: appellant.name,
      email: appellant.email,
      phone: appellant.phone,
      interest: appellant.interest,
      image: undefined,
    } as any;
    if (appellant.image instanceof MemoryStoredFile) {
      const imageBuffer = appellant.image.buffer;
      const fileName =
        generateHashTime(imageBuffer) + '.' + appellant.image.extension;

      const filePath = resolve(
        __dirname,
        this.configService.get<string>('APP_USER_FILES_FOLDER'),
        fileName,
      );
      writeFileSync(filePath, imageBuffer);

      appellantData.image = fileName;
    }

    const newAppellant = this.appellantRepository.create(appellantData);
    return this.appellantRepository.save(newAppellant);
  }

  async findAll(
    offset: SelectAppellantDto['offset'],
    limit: SelectAppellantDto['limit'],
  ): Promise<{ entities: AppellantEntity[]; totalCount: number }> {
    const [entities, totalCount] = await Promise.all([
      this.appellantRepository.find({
        skip: offset,
        take: limit,
      }),
      this.appellantRepository.count(),
    ]);

    return { entities, totalCount };
  }
}
