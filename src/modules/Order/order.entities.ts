import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { OrderStatus, OrderStatusType } from '../../core/enums';
import { IsInt, Length, Min } from 'class-validator';
import { Product } from '../product/product.entities';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({
    type: 'enum',
    enum: OrderStatus.options,
  })
  state!: OrderStatusType;

  @Column()
  @Length(5, 50)
  clientName!: string;

  @Column()
  @Length(5, 50)
  address!: string;

  @Column()
  @IsInt()
  @Min(1)
  stockRequired!: number;

  @ManyToOne(() => Product, (product) => product.orders)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  product!: Product;
}
