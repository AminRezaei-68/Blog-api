import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

type UserResponse = Partial<User> & { id: string };

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponse> {
    const { email } = createUserDto;

    const userExists = await this.userModel.findOne({ email }).exec();
    if (userExists) {
      throw new BadRequestException('A user with this email already exists.');
    }

    const user = new this.userModel(createUserDto);
    const savedUser = await user.save();

    return {
      id: savedUser._id.toString(),
      email: savedUser.email,
      username: savedUser.username,
    };
  }

  async findAll(): Promise<UserResponse[]> {
    const users = await this.userModel.find().exec();

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
    };
  }

  async findByUsernameOrEmail(
    usernameOrEmail: string,
  ): Promise<UserResponse | undefined> {
    const user = await this.userModel
      .findOne({
        $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      })
      .exec();

    return user
      ? { id: user._id.toString(), username: user.username, email: user.email }
      : undefined;
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
