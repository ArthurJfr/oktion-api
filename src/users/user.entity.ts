import { Entity, Column, PrimaryGeneratedColumn , CreateDateColumn,UpdateDateColumn, OneToMany  } from 'typeorm';
import { FriendRequest } from '../friend-requests/friend-request.entity';


@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({default : 'user'})
  role: string;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime', nullable: true })
  updated_at: Date;

  @Column({ default: true })
  isActive: boolean;

  

  @OneToMany(() => FriendRequest, request => request.sender)
  sentFriendRequests: FriendRequest[];

  @OneToMany(() => FriendRequest, request => request.receiver)
  receivedFriendRequests: FriendRequest[];
}
