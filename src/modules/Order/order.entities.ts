import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { OrderStatus, OrderStatusType } from '../../core/enums';
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
  clientName!: string;

  @Column()
  address!: string;

  @Column()
  stockRequired!: number;

  @Column()
  productId!: number;

  @ManyToOne(() => Product, (product) => product.orders)
  @JoinColumn({ name: 'productId', referencedColumnName: 'id' })
  product!: Product;
}
