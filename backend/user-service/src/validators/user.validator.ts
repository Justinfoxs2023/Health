@injectable()
export class UserValidator {
  validateProfile(data: UpdateProfileDTO): ValidationResult {
    const schema = Joi.object({
      username: Joi.string().min(3).max(30),
      email: Joi.string().email(),
      avatar: Joi.string().uri()
    });
    
    return schema.validate(data);
  }
} 