import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { FriendRequest } from 'src/friends/friend-request.entity';
export const databaseConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  username: process.env.DB_USERNAME || 'root',
  //password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'oktiondb',
entities: [User, FriendRequest],
  synchronize: true, // Désactivez en production
 
};
