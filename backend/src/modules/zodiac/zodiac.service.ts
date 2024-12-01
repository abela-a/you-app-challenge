import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Zodiac } from '../../app/schemas/zodiac.schemas';
import mongoose, { Model } from 'mongoose';
import { CreateZodiacDto } from './dto/create-zodiac.dto';
import { GetZodiacsDto } from './dto/get-zodiacs.dto';
import { UpdateZodiacDto } from './dto/update-zodiac.dto';
import * as defaultZodiacJson from './zodiac.data.json';

@Injectable()
export class ZodiacService {
  constructor(@InjectModel(Zodiac.name) private zodiacModel: Model<Zodiac>) {}

  async initDefaultZodiacs() {
    const zodiacs = await this.getZodiacs({ page: 1, limit: 1 });

    if (zodiacs.data.length === 0) {
      for (const zodiac of defaultZodiacJson) {
        await this.createZodiac(zodiac);
      }
    }
  }

  async createZodiac(createZodiacDto: CreateZodiacDto) {
    const zodiac = new this.zodiacModel(createZodiacDto);

    return await zodiac.save();
  }

  async getZodiacs(getZodiacsDto: GetZodiacsDto) {
    const page = getZodiacsDto.page;
    const limit = getZodiacsDto.limit;
    const skip = (page - 1) * limit;

    const zodiacs = await this.zodiacModel.find().skip(skip).limit(limit);
    const total = await this.zodiacModel.countDocuments();

    return {
      data: zodiacs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getZodiacById(id: string) {
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId) throw new BadRequestException('Invalid ID');

    const zodiac = await this.zodiacModel.findById(id);
    if (!zodiac) throw new NotFoundException('Zodiac not found');

    return zodiac;
  }

  async getZodiacByDate(date: string) {
    const zodiac = await this.zodiacModel.findOne({
      start_date: { $lte: date },
      end_date: { $gte: date },
    });
    if (!zodiac) throw new NotFoundException('Zodiac not found');

    return zodiac;
  }

  async getZodiacsByDateRange(startDate: string, endDate: string) {
    const zodiacs = await this.zodiacModel.find({
      start_date: { $gte: startDate },
      end_date: { $lte: endDate },
    });
    if (!zodiacs) throw new NotFoundException('Zodiac not found');

    return zodiacs;
  }

  async updateZodiac(id: string, updateZodiacDto: UpdateZodiacDto) {
    return await this.zodiacModel.findByIdAndUpdate(id, updateZodiacDto, {
      new: true,
    });
  }
  async deleteZodiac(id: string) {
    return await this.zodiacModel.findByIdAndDelete(id);
  }
}
