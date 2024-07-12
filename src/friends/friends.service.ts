import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FriendRequest, FriendRequestStatus } from '../friend-requests/friend-request.entity';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';


@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(FriendRequest)
    private friendRequestRepository: Repository<FriendRequest>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private usersService: UsersService,
  ) {}

  async getFriends(userId: number, page: number, limit: number) {
    const [friends, total] = await this.friendRequestRepository.findAndCount({
      where: [
        { sender: { id: userId }, status: 'accepted' as FriendRequestStatus },
        { receiver: { id: userId }, status: 'accepted' as FriendRequestStatus },
      ],
      skip: (page - 1) * limit,
      take: limit,
      relations: ['sender', 'receiver'],
    });

    const friendUsers = friends.map(fr => (fr.sender.id === userId ? fr.receiver : fr.sender));

    return {
      friends: friendUsers,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getFriendRequests(userId: number) {
    return this.friendRequestRepository.find({
      where: { receiver: { id: userId }, status: 'pending' as FriendRequestStatus },
      relations: ['sender'],
    });
  }

  async sendFriendRequest(userId: number, friendUsername: string) {
    const friend = await this.usersService.findByUsername(friendUsername);
    if (!friend) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    const friendRequest = this.friendRequestRepository.create({
      sender: { id: userId } as User,
      receiver: { id: friend.id } as User,
      status: 'pending' as FriendRequestStatus,
    });

    return this.friendRequestRepository.save(friendRequest);
  }

  async acceptFriendRequest(userId: number, requestId: number) {
    const friendRequest = await this.friendRequestRepository.findOne({
      where: { id: requestId },
      relations: ['sender', 'receiver'],
    });

    if (!friendRequest || friendRequest.receiver.id !== userId) {
      throw new Error('Invalid friend request');
    }

    friendRequest.status = 'accepted';

    return this.friendRequestRepository.save(friendRequest);
  }

  async declineFriendRequest(userId: number, requestId: number) {
    const friendRequest = await this.friendRequestRepository.findOne({
      where: { id: requestId },
    });

    if (!friendRequest || friendRequest.receiver.id !== userId) {
      throw new Error('Invalid friend request');
    }

    friendRequest.status = 'rejected';

    return this.friendRequestRepository.save(friendRequest);
  }

  async removeFriend(userId: number, friendId: number) {
    const friendRequests = await this.friendRequestRepository.find({
      where: [
        { sender: { id: userId }, receiver: { id: friendId }, status: 'accepted' as FriendRequestStatus },
        { sender: { id: friendId }, receiver: { id: userId }, status: 'accepted' as FriendRequestStatus },
      ],
    });

    await this.friendRequestRepository.remove(friendRequests);

    return { message: 'Friend removed' };
  }
}
