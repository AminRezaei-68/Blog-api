import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard';
import { PostOwnershipGuard } from 'src/common/guards/post-ownership/post-ownership.guard';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('admin')
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'user')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  @Roles('admin')
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Patch(':id')
  @Roles('admin', 'user')
  @UseGuards(PostOwnershipGuard)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @Roles('admin')
  async remove(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
