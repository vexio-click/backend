import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class SelectAppellantDto {
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  offset?: number = 0;
}
