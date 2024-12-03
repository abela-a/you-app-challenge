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
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class FriendshipService {
  constructor(
    @InjectModel(Friendship.name) private friendshipModel: Model<Friendship>,
    private notificationService: NotificationService,
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

    const friendshipStore = new this.friendshipModel({
      ...createFriendshipDto,
      initiator: userId,
    });
    const friendship = await friendshipStore.save();

    this.notificationService.publishMessage(
      'notification.friend_request',
      friendship,
    );

    return friendship;
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
    const friendship = await this.getFriendshipById(id);
    if (friendship.status === status) {
      throw new BadRequestException('Friendship already in this status');
    }

    if (!Object.values(FriendshipStatus).includes(status)) {
      throw new BadRequestException('Invalid status');
    }

    const updatedFriendship = await this.friendshipModel.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );

    if (status === FriendshipStatus.ACCEPTED) {
      this.notificationService.publishMessage(
        'notification.request_accepted',
        updatedFriendship,
      );
    }

    return updatedFriendship;
  }
}
