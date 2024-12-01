import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../app/schemas/user.schemas';
import mongoose, { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterDto } from '../auth/dto/register.dto';
import { GetUsersDto } from './dto/get-users.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(createUserDto: CreateUserDto | RegisterDto) {
    const userExists = await this.userModel.findOne({
      $or: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
    });

    if (userExists) throw new BadRequestException('User already exists');

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });

    return await user.save();
  }

  async getUsers(getUsersDto: GetUsersDto) {
    const page = getUsersDto.page;
    const limit = getUsersDto.limit;
    const skip = (page - 1) * limit;

    const users = await this.userModel.find().skip(skip).limit(limit);
    const total = await this.userModel.countDocuments();

    return {
      data: users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getUserById(id: string) {
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId) throw new BadRequestException('Invalid ID');

    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async getUserByUsernameOrEmail(identifier: string) {
    const filter = { $or: [{ username: identifier }, { email: identifier }] };
    const user = await this.userModel.findOne(filter);

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);

    return await this.userModel.findByIdAndUpdate(
      id,
      { ...updateUserDto, password: hashedPassword },
      { new: true },
    );
  }

  async updateRefreshToken(
    id: string,
    refreshToken: string | null,
  ): Promise<void> {
    await this.userModel.findByIdAndUpdate(id, { refresh_token: refreshToken });
  }

  async updateLastSeen(userId: string) {
    return this.userModel.findByIdAndUpdate(userId, { last_seen: new Date() });
  }

  async updateOnlineStatus(userId: string, isOnline: boolean) {
    return this.userModel.findByIdAndUpdate(userId, { is_online: isOnline });
  }

  async deleteUser(id: string) {
    return await this.userModel.findByIdAndDelete(id);
  }
}
