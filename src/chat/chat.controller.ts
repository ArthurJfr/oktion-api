import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('messages')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async create(@Body() createMessageDto: CreateMessageDto) {
    return this.chatService.create(createMessageDto);
  }

  @Get()
  async findAll() {
    return this.chatService.findAll();
  }

  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string) {
    return this.chatService.findByUser(userId);
  }
}
