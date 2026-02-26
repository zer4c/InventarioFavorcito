import { IsBoolean, IsInt, Min } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from '../product/product.entities';
import { Order } from '../Order/order.entities';

@Entity()
export class Inventory {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column()
  @IsInt()
  @Min(0)
  stock!: number;

  @Column()
  @IsInt()
  productId!: number;

  @OneToOne(() => Product)
  @JoinColumn({ name: 'productId', referencedColumnName: 'id' })
  product!: Product;
}

@Entity()
export class InventoryHistory {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column()
  @IsInt()
  @Min(0)
  stock!: number;

  @Column()
  @IsBoolean()
  isOut!: boolean;

  @Column()
  @IsInt()
  productId!: number;

  @Column()
  @IsInt()
  orderId!: number;

  @OneToOne(() => Product)
  @JoinColumn({ name: 'productId', referencedColumnName: 'id' })
  product!: Product;

  @OneToOne(() => Order, { nullable: true })
  @JoinColumn({ name: 'orderId', referencedColumnName: 'id' })
  order?: Order;
}
