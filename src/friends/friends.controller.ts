import { CurrentUser } from '../auth/get-user.decorator';
import { Controller, Get, Post, Delete, Param, Body, UseGuards, Query } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../users/user.entity';

@Controller('friends')
@UseGuards(AuthGuard('jwt'))
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Post('request')
  async sendFriendRequest(
    @CurrentUser() user,
    @Body('friendUsername') friendUsername: string,
  ) {
    return this.friendsService.sendFriendRequest(user.userId, friendUsername);
  }

  @Get()
  async getFriends(
    @CurrentUser() user,
  ) {
    return this.friendsService.getFriends(user.userId);
  }

  @Get('requests')
  async getFriendRequests(@CurrentUser() user) {
    return this.friendsService.getFriendRequests(user.userId);
  }

  @Post('accept/:requestId')
  async acceptFriendRequest(
    @CurrentUser() user,
    @Param('requestId') requestId: number,
  ) {
    return this.friendsService.acceptFriendRequest(user.userId, requestId);
  }

  @Post('decline/:requestId')
  async declineFriendRequest(
    @CurrentUser() user,
    @Param('requestId') requestId: number,
  ) {
    return this.friendsService.declineFriendRequest(user.userId, requestId);
  }

  @Delete('remove/:friendId')
  async removeFriend(
    @CurrentUser() user,
    @Param('friendId') friendId: number,
  ) {
    return this.friendsService.removeFriend(user.userId, friendId);
  }
}
