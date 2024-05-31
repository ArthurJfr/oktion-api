import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
export const databaseConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  username: process.env.DB_USERNAME || 'root',
  //password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'oktiondb',
entities: [User],
  synchronize: true, // Désactivez en production
 
};
