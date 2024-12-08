import { IsEnum } from '@nestjs/class-validator';

export class UpdateUserRoleDto {
  @IsEnum(['user', 'admin'])
  role: string;
}
