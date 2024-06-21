import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FriendRequest } from './friend-request.entity';
import { User } from '../users/user.entity';
import { CreateFriendRequestDto } from './dto/create-friend-request.dto';
import { UpdateFriendRequestDto } from './dto/update-friend-request.dto';

@Injectable()
export class FriendRequestsService {
  constructor(
    @InjectRepository(FriendRequest)
    private friendRequestRepository: Repository<FriendRequest>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async sendRequest(senderId: number, createFriendRequestDto: CreateFriendRequestDto): Promise<FriendRequest> {
    const sender = await this.userRepository.findOne(senderId);
    if (!sender) {
      throw new NotFoundException('Sender not found');
    }

    const receiver = await this.userRepository.findOne({ where: { username: createFriendRequestDto.receiverUsername } });
    if (!receiver) {
      throw new NotFoundException('Receiver not found');
    }

    const friendRequest = this.friendRequestRepository.create({
      sender,
      receiver,
      status: 'pending'
    });
    return this.friendRequestRepository.save(friendRequest);
  }

  async respondToRequest(id: number, updateFriendRequestDto: UpdateFriendRequestDto): Promise<FriendRequest> {
    const friendRequest = await this.friendRequestRepository.findOne(id, { relations: ['sender', 'receiver'] });
    if (!friendRequest) {
      throw new NotFoundException('Friend request not found');
    }
    friendRequest.status = updateFriendRequestDto.status;
    return this.friendRequestRepository.save(friendRequest);
  }

  async getPendingRequests(userId: number): Promise<FriendRequest[]> {
    return this.friendRequestRepository.find({ where: { receiver: userId, status: 'pending' } });
  }
}
