import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendRequest } from './friend-request.entity';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { UsersModule } from '../users/users.module';
import { User } from '../users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([FriendRequest, User]),
    UsersModule,
  ],
  providers: [FriendsService],
  controllers: [FriendsController],
})
export class FriendsModule {}
 