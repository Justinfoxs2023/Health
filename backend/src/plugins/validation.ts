import mongoose from 'mongoose';
import { logger } from '../services/logger';

interface ValidationError {
  field: string;
  value: any;
  rule: string;
  message: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

class ValidationPlugin {
  private static readonly EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  private static readonly PHONE_REGEX = /^\+?[\d\s-]{10,}$/;
  private static readonly PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;

  /**
   * 添加验证规则到schema
   */
  static addValidation(schema: mongoose.Schema): void {
    // 添加通用验证中间件
    schema.pre('validate', function(next) {
      const validationResult = ValidationPlugin.validateDocument(this);
      if (!validationResult.isValid) {
        const error = new mongoose.Error.ValidationError(null);
        validationResult.errors.forEach(err => {
          error.errors[err.field] = new mongoose.Error.ValidatorError({
            message: err.message,
            type: err.rule,
            path: err.field,
            value: err.value
          });
        });
        next(error);
      } else {
        next();
      }
    });

    // 添加自定义验证方法
    schema.methods.validate = async function(): Promise<ValidationResult> {
      return ValidationPlugin.validateDocument(this);
    };
  }

  /**
   * 验证文档
   */
  private static validateDocument(doc: any): ValidationResult {
    const errors: ValidationError[] = [];
    const schema = doc.schema;

    for (const path in schema.paths) {
      const schemaType = schema.paths[path];
      const value = doc.get(path);

      // 必填字段验证
      if (schemaType.isRequired && !value) {
        errors.push({
          field: path,
          value,
          rule: 'required',
          message: `${path} is required`
        });
        continue;
      }

      // 类型验证
      if (value !== undefined && value !== null) {
        const typeError = this.validateType(path, value, schemaType);
        if (typeError) {
          errors.push(typeError);
          continue;
        }

        // 自定义验证规则
        const customErrors = this.validateCustomRules(path, value, schemaType);
        errors.push(...customErrors);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * 验证字段类型
   */
  private static validateType(
    field: string,
    value: any,
    schemaType: mongoose.SchemaType
  ): ValidationError | null {
    const type = schemaType.instance;

    switch (type) {
      case 'String':
        if (typeof value !== 'string') {
          return {
            field,
            value,
            rule: 'type',
            message: `${field} must be a string`
          };
        }
        break;

      case 'Number':
        if (typeof value !== 'number' || isNaN(value)) {
          return {
            field,
            value,
            rule: 'type',
            message: `${field} must be a number`
          };
        }
        break;

      case 'Date':
        if (!(value instanceof Date) || isNaN(value.getTime())) {
          return {
            field,
            value,
            rule: 'type',
            message: `${field} must be a valid date`
          };
        }
        break;

      case 'Boolean':
        if (typeof value !== 'boolean') {
          return {
            field,
            value,
            rule: 'type',
            message: `${field} must be a boolean`
          };
        }
        break;

      case 'ObjectID':
        if (!mongoose.Types.ObjectId.isValid(value)) {
          return {
            field,
            value,
            rule: 'type',
            message: `${field} must be a valid ObjectID`
          };
        }
        break;
    }

    return null;
  }

  /**
   * 验证自定义规则
   */
  private static validateCustomRules(
    field: string,
    value: any,
    schemaType: mongoose.SchemaType
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    // 获取字段定义中的验证规则
    const options = (schemaType as any).options || {};

    // 字符串长度验证
    if (typeof value === 'string') {
      if (options.minLength && value.length < options.minLength) {
        errors.push({
          field,
          value,
          rule: 'minLength',
          message: `${field} must be at least ${options.minLength} characters long`
        });
      }
      if (options.maxLength && value.length > options.maxLength) {
        errors.push({
          field,
          value,
          rule: 'maxLength',
          message: `${field} must be no more than ${options.maxLength} characters long`
        });
      }
    }

    // 数值范围验证
    if (typeof value === 'number') {
      if (options.min !== undefined && value < options.min) {
        errors.push({
          field,
          value,
          rule: 'min',
          message: `${field} must be at least ${options.min}`
        });
      }
      if (options.max !== undefined && value > options.max) {
        errors.push({
          field,
          value,
          rule: 'max',
          message: `${field} must be no more than ${options.max}`
        });
      }
    }

    // 邮箱格式验证
    if (options.isEmail && typeof value === 'string' && !this.EMAIL_REGEX.test(value)) {
      errors.push({
        field,
        value,
        rule: 'email',
        message: `${field} must be a valid email address`
      });
    }

    // 手机号格式验证
    if (options.isPhone && typeof value === 'string' && !this.PHONE_REGEX.test(value)) {
      errors.push({
        field,
        value,
        rule: 'phone',
        message: `${field} must be a valid phone number`
      });
    }

    // 密码强度验证
    if (options.isPassword && typeof value === 'string' && !this.PASSWORD_REGEX.test(value)) {
      errors.push({
        field,
        value,
        rule: 'password',
        message: `${field} must contain at least 8 characters, including letters and numbers`
      });
    }

    // 枚举值验证
    if (options.enum && !options.enum.includes(value)) {
      errors.push({
        field,
        value,
        rule: 'enum',
        message: `${field} must be one of: ${options.enum.join(', ')}`
      });
    }

    // 自定义验证函数
    if (typeof options.validate === 'function') {
      try {
        const isValid = options.validate(value);
        if (!isValid) {
          errors.push({
            field,
            value,
            rule: 'custom',
            message: options.message || `${field} failed custom validation`
          });
        }
      } catch (error) {
        logger.error('Custom validation error:', error);
        errors.push({
          field,
          value,
          rule: 'custom',
          message: 'Custom validation failed'
        });
      }
    }

    return errors;
  }

  /**
   * 添加自定义验证规则
   */
  static addCustomValidation(
    schema: mongoose.Schema,
    field: string,
    validator: (value: any) => boolean,
    message: string
  ): void {
    const path = schema.path(field);
    if (path) {
      path.validate(validator, message);
    }
  }
}

// 导出插件
export { ValidationPlugin, ValidationError, ValidationResult };

// 默认导出插件函数
export default function(schema: mongoose.Schema) {
  ValidationPlugin.addValidation(schema);
} 