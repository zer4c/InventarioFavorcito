import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Order } from '../Order/order.entities';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ unique: true })
  name!: string;

  @Column()
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => ProductHistory, (history) => history.product)
  history! : ProductHistory[]

  @OneToMany(() => Order, (order) => order.product)
  orders! : Order[]

}

@Entity()
export class ProductHistory {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column()
  NameChanged!: boolean;

  @Column()
  IsActiveChanged!: boolean;

  @CreateDateColumn()
  createAt!: Date;

  @ManyToOne(() => Product, (product) => product.history)
  product!: Product

}
