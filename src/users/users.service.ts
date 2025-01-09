import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { PaginationQueryDto } from '../common/dto/Pagination-query.dto';

type UserResponse = Partial<User> & { id: string };

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const { currentPassword, newPassword } = changePasswordDto;

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();
    return { message: 'Password updated successfully' };
  }

  async updateStatus(userId: string, updateUserStatusDto: UpdateUserStatusDto) {
    const { isActive } = updateUserStatusDto;

    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    user.isActive = isActive;
    await user.save();

    return {
      message: `User status updated to ${isActive ? 'active' : 'inactive'}`,
    };
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponse> {
    const { email, password } = createUserDto;

    const userExists = await this.userModel.findOne({ email }).exec();
    if (userExists) {
      throw new BadRequestException('A user with this email already exists.');
    }

    const hashedPassword = await this.hashPassword(password);

    const user = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    const savedUser = await user.save();

    return {
      id: savedUser._id.toString(),
      email: savedUser.email,
      username: savedUser.username,
    };
  }

  async findAll(
    paginationQuaryDto: PaginationQueryDto,
  ): Promise<UserResponse[]> {
    const { offset = 0, limit = 10 } = paginationQuaryDto;
    const users = await this.userModel.find().skip(offset).limit(limit).exec();

    return users.map((user) => ({
      id: user._id.toString(),
      username: user.username,
      email: user.email,
    }));
  }

  async findOne(id: string): Promise<UserResponse> {
    const user = await this.userModel.findById(id).exec();

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found.`);
    }

    return {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      isActive: user.isActive,
    };
  }

  async findByUsernameOrEmail(
    usernameOrEmail: string,
    includeSensitiveData: boolean = false,
  ): Promise<UserResponse | undefined> {
    const user = await this.userModel
      .findOne({
        $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      })
      .exec();

    if (!user) {
      return undefined;
    }

    const userRespone: UserResponse = {
      id: user._id.toString(),
      username: user.username,
      name: user.name,
      email: user.email,
      roles: user.roles,
      isActive: user.isActive,
    };

    if (includeSensitiveData) {
      userRespone.password = user.password;
    }

    return userRespone;
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponse> {
    const user = await this.userModel.findById(id).exec();

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found.`);
    }

    if (updateUserDto.email) {
      const emailExists = await this.userModel
        .findOne({ email: updateUserDto.email })
        .exec();
      if (emailExists && emailExists.id !== id) {
        throw new BadRequestException('This email is already in use.');
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await this.hashPassword(updateUserDto.password);
    }

    Object.assign(user, updateUserDto);
    const updatedUser = await user.save();

    return {
      id: updatedUser._id.toString(),
      username: updatedUser.username,
      email: updatedUser.email,
    };
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    const user = await this.userModel.findByIdAndDelete(id).exec();

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found.`);
    }

    return { message: `User with ID "${id}" has been deleted.` };
  }
}
