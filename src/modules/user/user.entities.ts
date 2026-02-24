import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { UserRole, UserRoleType } from '../../core/enums';

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id!: Number;

  @Column({ type: 'enum', enum: UserRole.options })
  role!: UserRoleType;

  @CreateDateColumn()
  createdAt!: Date;
}
