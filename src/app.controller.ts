import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('repos')
  async getRepos(res: Response) {
    return await res.json(await this.appService.getRepos());
  }
  @Get('pdf')
  async getPdf(res) {
    return res.send(await this.appService.getPdf());
  }
}
