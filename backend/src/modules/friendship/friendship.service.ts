import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Friendship } from '../../app/schemas/friendship.schemas';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { GetFriendshipsDto } from './dto/get-friendship.dto';
import { FriendshipStatus } from '../../app/enums/friendship-status';
import { CreateFriendshipDto } from './dto/create-friendship.dto';

@Injectable()
export class FriendshipService {
  constructor(
    @InjectModel(Friendship.name) private friendshipModel: Model<Friendship>,
  ) {}

  async createFriendship(
    userId: string | mongoose.Types.ObjectId,
    createFriendshipDto: CreateFriendshipDto,
  ) {
    const checkFriendship = await this.friendshipModel.findOne({
      $or: [{ initiator: userId }, { recipient: userId }],
    });

    if (checkFriendship) {
      throw new BadRequestException('Friendship already exists');
    }

    const friendship = new this.friendshipModel({
      ...createFriendshipDto,
      initiator: userId,
    });
    return await friendship.save();
  }

  async getFriendshipByUserId(
    userId: string | mongoose.Types.ObjectId,
    getFriendshipsDto: GetFriendshipsDto,
  ) {
    const page = getFriendshipsDto.page;
    const limit = getFriendshipsDto.limit;
    const skip = (page - 1) * limit;

    const friendships = await this.friendshipModel
      .find({ $or: [{ initiator: userId }, { recipient: userId }] })
      .skip(skip)
      .limit(limit);

    const total = await this.friendshipModel.countDocuments();

    return {
      data: friendships,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getFriendshipById(id: string | mongoose.Types.ObjectId) {
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId) throw new BadRequestException('Invalid ID');

    const friendship = await this.friendshipModel.findById(id);
    if (!friendship) throw new NotFoundException('Friendship not found');

    return friendship;
  }

  async updateFriendshipStatus(
    id: string | mongoose.Types.ObjectId,
    status: FriendshipStatus,
  ) {
    return await this.friendshipModel.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );
  }
}
