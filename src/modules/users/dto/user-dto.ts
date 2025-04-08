import { Exclude } from 'class-transformer';

export class UserDto {
  id: number;
  name: string;
  email: string;

  @Exclude()
  password: string;

  isVerified: boolean;
  isDeleted: boolean;
}