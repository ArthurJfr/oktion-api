
import { Module, Logger } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { databaseConfig } from './config/database.config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import * as mongoose from 'mongoose';
import { ChatModule } from './chat/chat.module';

import { FriendsModule } from './friends/friends.module';

import { ProductsModule } from './products/products.module';
import { AuctionsModule } from './auctions/auctions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => databaseConfig,
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    ChatModule,
    FriendsModule,
    ProductsModule,
    AuctionsModule
    
   
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  private readonly logger = new Logger(AppModule.name);

  constructor() {
    const mongoose = require('mongoose');
    mongoose.connection.once('open', () => {
      this.logger.log('Connected to MongoDB');
    });
    mongoose.connection.on('error', (err) => {
      this.logger.error(`MongoDB connection error: ${err}`);
    });
  }
}
