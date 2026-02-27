import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Product } from '../product/product.entities';
import { Order } from '../Order/order.entities';

@Entity()
export class Inventory {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column()
  stock!: number;

  @Column()
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
  stock!: number;

  @Column()
  isOut!: boolean;

  @Column()
  productId!: number;

  @Column({ nullable: true })
  orderId!: number;

  @ManyToOne(() => Product, (product) => product.inventoryHistory)
  @JoinColumn({ name: 'productId', referencedColumnName: 'id' })
  product!: Product;

  @OneToOne(() => Order, { nullable: true })
  @JoinColumn({ name: 'orderId', referencedColumnName: 'id' })
  order?: Order;
}
