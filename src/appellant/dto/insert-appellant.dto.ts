import { Transform } from 'class-transformer';
import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';
import {
  HasMimeType,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';

export class InsertAppellantDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  phone: number;

  @IsString()
  interest: string;

  @IsOptional()
  @IsFile()
  @MaxFileSize(100 * 1024) //100kb in bytes
  @HasMimeType(['image/*'])
  image?: MemoryStoredFile | string;
}
