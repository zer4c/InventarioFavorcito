import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { UserRole } from '../../core/enums';
@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id!: Number;

  @Column({ unique: true })
  name!: string;

  @Column({
    type: 'enum',
    enum: UserRole,
  })
  role!: UserRole;

  @CreateDateColumn()
  createdAt!: Date;
}
