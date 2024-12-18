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

export interface ILoginDTO {
  /** email 的描述 */
  email: string;
  /** password 的描述 */
  password: string;
}

export interface IRegisterDTO {
  /** email 的描述 */
  email: string;
  /** password 的描述 */
  password: string;
  /** username 的描述 */
  username: string;
}

export interface IUpdateProfileDTO {
  /** username 的描述 */
  username?: string;
  /** email 的描述 */
  email?: string;
  /** avatar 的描述 */
  avatar?: string;
}
