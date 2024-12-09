import { IsBoolean, IsNotEmpty } from '@nestjs/class-validator';

export class UpdateUserStatusDto {
  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;
}
