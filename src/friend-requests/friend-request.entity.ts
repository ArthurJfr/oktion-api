import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

export type FriendRequestStatus = 'pending' | 'accepted' | 'rejected';

@Entity()
export class FriendRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.sentFriendRequests)
  sender: User;

  @ManyToOne(() => User, user => user.receivedFriendRequests)
  receiver: User;

  @Column()
  status: FriendRequestStatus;
}
