import { Controller, Get, Post, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../users/user.entity';

@Controller('friends')
@UseGuards(AuthGuard('jwt'))
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Get()
  async getFriends(
    @CurrentUser() user: User,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.friendsService.getFriends(user.id, Number(page), Number(limit));
  }

  @Get('requests')
  async getFriendRequests(@CurrentUser() user: User) {
    return this.friendsService.getFriendRequests(user.id);
  }

  @Post('request')
  async sendFriendRequest(
    @CurrentUser() user: User,
    @Body('friendUsername') friendUsername: string,
  ) {
    return this.friendsService.sendFriendRequest(user.id, friendUsername);
  }

  @Post('accept/:requestId')
  async acceptFriendRequest(
    @CurrentUser() user: User,
    @Param('requestId') requestId: number,
  ) {
    return this.friendsService.acceptFriendRequest(user.id, requestId);
  }

  @Post('decline/:requestId')
  async declineFriendRequest(
    @CurrentUser() user: User,
    @Param('requestId') requestId: number,
  ) {
    return this.friendsService.declineFriendRequest(user.id, requestId);
  }

  @Delete('remove/:friendId')
  async removeFriend(
    @CurrentUser() user: User,
    @Param('friendId') friendId: number,
  ) {
    return this.friendsService.removeFriend(user.id, friendId);
  }
}
