/**
 * @fileoverview TS 文件 validation.d.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

declare module 'class-validator' {
  export function validate(
    object: object,
    validatorOptions?: ValidatorOptions,
  ): Promise<ValidationError[]>;
  export function validateOrReject(
    object: object,
    validatorOptions?: ValidatorOptions,
  ): Promise<void>;

  export interface ValidatorOptions {
    skipMissingProperties: boolean;
    whitelist: boolean;
    forbidNonWhitelisted: boolean;
    groups: string;
    dismissDefaultMessages: boolean;
    validationError: {
      target: boolean;
      value: boolean;
    };
  }

  export interface ValidationError {
    target: object;
    property: string;
    value: any;
    constraints: { type: string: string };
    children?: ValidationError[];
  }
}

declare module 'class-transformer' {
  export function plainToClass<T>(
    cls: ClassConstructor<T>,
    plain: object,
    options?: ClassTransformOptions,
  ): T;

  export interface ClassTransformOptions {
    excludeExtraneousValues: boolean;
    groups: string;
    version: number;
    excludePrefixes: string;
  }

  export interface ClassConstructor<T> {
    new (...args: any[]): T;
  }
}
