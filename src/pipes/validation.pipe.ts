import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

// 定义类型
export interface IArgumentMetadata {
  /** type 的描述 */
    type: body  query  param  custom;
  metatype: any;
  data: string;
}

export class BadRequestException extends Error {
  constructor(public response: { message: string; details: string[] }) {
    super(response.message);
    this.name = 'BadRequestException';
  }

  getStatus() {
    return 400;
  }
}

export interface IPipeTransform<T = any, R = any> {
  transform(value: T, metadata: IArgumentMetadata): R | Promise<R>;
}

@Injectable()
export class ValidationPipe implements IPipeTransform<any> {
  async transform(value: any, { metatype }: IArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    // 确保 value 是一个对象并进行类型断言
    if (typeof value !== 'object' || value === null) {
      throw new BadRequestException({
        message: '无效的输入数据',
        details: ['输入必须是一个对象'],
      });
    }

    // 使��类型断言并确保类型安全
    const object = plainToClass(metatype, value as object);
    const errors: ValidationError[] = await validate(object as object);

    if (errors.length > 0) {
      const messages = errors.map(err => {
        return `${err.property}: ${Object.values(err.constraints || {}).join(', ')}`;
      });

      throw new BadRequestException({
        message: '数据验证失败',
        details: messages,
      });
    }

    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
