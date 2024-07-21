import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { User } from '../users/user.entity';

export enum FriendRequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined'
}

@Entity()
export class FriendRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.sentFriendRequests)
  sender: User;

  @ManyToOne(() => User, user => user.receivedFriendRequests)
  receiver: User;

  @Column({
    type: 'enum',
    enum: FriendRequestStatus,
    default: FriendRequestStatus.PENDING
  })
  status: FriendRequestStatus;
}
 