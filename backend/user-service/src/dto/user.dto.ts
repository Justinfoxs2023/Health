import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class CreateUserDTO {
  @IsString()
  @MinLength(3)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  profile?: {
    fullName: string;
    phoneNumber?: string;
    dateOfBirth?: Date;
    gender?: string;
  };
}

export class UpdateUserDTO {
  @IsOptional()
  @IsString()
  @MinLength(3)
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  profile?: Partial<UserProfile>;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  email: string;
  password: string;
  username: string;
}

export interface UpdateProfileDTO {
  username?: string;
  email?: string;
  avatar?: string;
} 