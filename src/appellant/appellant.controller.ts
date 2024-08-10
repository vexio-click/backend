import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { AppellantService } from './appellant.service';
import { SelectAppellantDto } from './dto/select-appellant.dto';
import { InsertAppellantDto } from './dto/insert-appellant.dto';
import { FormDataRequest } from 'nestjs-form-data';

import { FastifyReply } from 'fastify';

@Controller('appellants')
export class AppellantController {
  constructor(private readonly appellantService: AppellantService) {}

  @Get()
  async getAppellants(
    @Query() dto: SelectAppellantDto,
    @Res() res: FastifyReply,
  ) {
    const { entities, totalCount } = await this.appellantService.findAll(
      dto.offset,
      dto.limit,
    );

    res.header('X-Total-Count', totalCount.toString());
    return res.status(200).send(entities);
  }
  @Post()
  @FormDataRequest()
  async postAppellants(@Body() dto: InsertAppellantDto) {
    return await this.appellantService.insert(dto);
  }
}
