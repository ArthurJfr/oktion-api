import { Controller, Post, Body, Param, Patch, Get, UseGuards, Req } from '@nestjs/common';
import { FriendRequestsService } from './friend-requests.service';
import { CreateFriendRequestDto } from './dto/create-friend-request.dto';
import { UpdateFriendRequestDto } from './dto/update-friend-request.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('friend-requests')
export class FriendRequestsController {
  constructor(private readonly friendRequestsService: FriendRequestsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async sendRequest(@Req() req, @Body() createFriendRequestDto: CreateFriendRequestDto) {
    const senderId = req.user.userId;
    return this.friendRequestsService.sendRequest(senderId, createFriendRequestDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async respondToRequest(@Param('id') id: number, @Body() updateFriendRequestDto: UpdateFriendRequestDto) {
    return this.friendRequestsService.respondToRequest(id, updateFriendRequestDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getPendingRequests(@Req() req) {
    const userId = req.user.userId;
    return this.friendRequestsService.getPendingRequests(userId);
  }
}
