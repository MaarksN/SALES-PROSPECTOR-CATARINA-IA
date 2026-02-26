import { Controller, Get, Post, Body, Req, Query, UseGuards } from '@nestjs/common';
import { SalesService } from './sales.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller("sales")
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Get("leads")
  @UseGuards(JwtAuthGuard)
  async getLeads(
    @Req() req,
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    const orgId = req.user?.orgId;
    return this.salesService.getLeads(
      orgId,
      skip ? Number(skip) : undefined,
      take ? Number(take) : undefined,
    );
  }

  @Post("leads")
  @UseGuards(JwtAuthGuard)
  async createLead(@Req() req, @Body() body) {
    const orgId = req.user?.orgId;
    return this.salesService.createLead(orgId, body);
  }

  @Post("generate")
  async generate(@Body() body: { prompt: string }) {
    const text = await this.salesService.generateText(body.prompt);
    return { text };
  }
}
