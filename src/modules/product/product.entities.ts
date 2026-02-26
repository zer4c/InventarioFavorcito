import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from '../Order/order.entities';
import { Length } from 'class-validator';
import { InventoryHistory } from '../inventory/inventory.entities';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ unique: true })
  @Length(1)
  name!: string;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ default: false })
  isDeleted!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => ProductHistory, (history) => history.product)
  history!: ProductHistory[];

  @OneToMany(
    () => InventoryHistory,
    (inventoryHistory) => inventoryHistory.product,
  )
  inventoryHistory!: InventoryHistory;

  @OneToMany(() => Order, (order) => order.product)
  orders!: Order[];
}

@Entity()
export class ProductHistory {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column()
  nameChanged!: boolean;

  @Column()
  isActiveChanged!: boolean;

  @Column()
  isDeletedChanged!: boolean;

  @Column()
  productId!: number;

  @CreateDateColumn()
  createAt!: Date;

  @ManyToOne(() => Product, (product) => product.history)
  @JoinColumn({ name: 'productId', referencedColumnName: 'id' })
  product!: Product;
}
