import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FriendRequest, FriendRequestStatus } from './friend-request.entity';
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

  async sendFriendRequest(userId: number, friendUsername: string): Promise<FriendRequest> {
    const friend = await this.usersService.findByUsername(friendUsername);
    if (!friend) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    const sender = await this.userRepository.findOne({where : {id : userId}});
    if (!sender) {
      throw new NotFoundException('Sender not found');
    }

    const existingRequest = await this.friendRequestRepository.findOne({
      where: {
        sender: sender,
        receiver: friend,
      },
    });

    if (existingRequest) {
      throw new BadRequestException('Friend request already sent');
    }

    const friendRequest = this.friendRequestRepository.create({
      sender: sender,
      receiver: friend,
      status: FriendRequestStatus.PENDING,
    });

    return this.friendRequestRepository.save(friendRequest);
  }

  async getFriends(userId: number) {
    const friends = await this.friendRequestRepository.find({
      where: [
        { sender: { id: userId }, status: FriendRequestStatus.ACCEPTED },
        { receiver: { id: userId }, status: FriendRequestStatus.ACCEPTED }
      ],
      relations: ['sender', 'receiver']
    });

    //console.log(friends);
      
    const allFriends = friends.map(fr => fr.sender.id === userId ? fr.receiver : fr.sender);
 
    return allFriends.map(friend => ({
      id: friend.id,
      username: friend.username,
      role: friend.role, // Incluez uniquement les champs nécessaires
    }));

  }

  async getFriendRequests(userId: number) {
    return this.friendRequestRepository.find({
      where: { receiver : { id: userId }, status: FriendRequestStatus.PENDING },
      relations: ['sender'],
    });
  }

  async acceptFriendRequest(userId: number, requestId: number) {
    const friendRequest = await this.friendRequestRepository.findOne({
      where: { id: requestId, receiver: { id: userId } },
    });

    if (!friendRequest) {
      throw new NotFoundException('Demande d\'ami non trouvée');
    }

    friendRequest.status = FriendRequestStatus.ACCEPTED;
    return this.friendRequestRepository.save(friendRequest);
  }

  async declineFriendRequest(userId: number, requestId: number) {
    const friendRequest = await this.friendRequestRepository.findOne({
      where: { id: requestId, receiver: { id: userId } },
    });

    if (!friendRequest) {
      throw new NotFoundException('Demande d\'ami non trouvée');
    }

    friendRequest.status = FriendRequestStatus.DECLINED;
    return this.friendRequestRepository.save(friendRequest);
  }

  async removeFriend(userId: number, friendId: number) {
    const friendRequest = await this.friendRequestRepository.findOne({
      where: [
        { sender: { id: userId }, receiver: { id: friendId }, status: FriendRequestStatus.ACCEPTED },
        { sender: { id: friendId }, receiver: { id: userId }, status: FriendRequestStatus.ACCEPTED }
      ],
    });

    if (!friendRequest) {
      throw new NotFoundException('Amitié non trouvée');
    }

    return this.friendRequestRepository.remove(friendRequest);
  }
}
