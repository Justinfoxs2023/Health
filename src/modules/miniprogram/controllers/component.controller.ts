import { ComponentService } from '../services/component.service';
import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { CreateComponentDto, UpdateComponentDto } from '../dto/component.dto';

@Controller()
export class ComponentController {
  constructor(private readonly componentService: ComponentService) {}

  @Post()
  async createComponent(@Body() createComponentDto: CreateComponentDto) {
    return this.componentService.registerComponent(createComponentDto.name, {}, createComponentDto);
  }

  @Get()
  async getComponent(@Param() name: string) {
    return this.componentService.getComponent(name);
  }

  @Get()
  async getAllComponents(@Query() status?: string) {
    if (status === 'active') {
      return this.componentService.getActiveComponents();
    }
    return this.componentService.getAllComponents();
  }

  @Put()
  async updateComponent(@Param() name: string, @Body() updateComponentDto: UpdateComponentDto) {
    return this.componentService.updateComponent(name, updateComponentDto);
  }

  @Delete()
  async deleteComponent(@Param() name: string) {
    return this.componentService.deleteComponent(name);
  }
}
