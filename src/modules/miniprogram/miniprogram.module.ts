import { Component, ComponentSchema } from './schemas/component.schema';
import { ComponentController } from './controllers/component.controller';
import { ComponentService } from './services/component.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: Component.name, schema: ComponentSchema }])],
  controllers: [ComponentController],
  providers: [ComponentService],
  exports: [ComponentService],
})
export class MiniprogramModule {}
