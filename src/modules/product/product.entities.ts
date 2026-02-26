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

@Entity()
export class Product {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ unique: true })
  name!: string;

  @Column({default: true})
  isActive!: boolean;

  @Column({default: false})
  isDeleted!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => ProductHistory, (history) => history.product)
  history!: ProductHistory[];

  @OneToMany(() => Order, (order) => order.product)
  orders!: Order[];
}

@Entity()
export class ProductHistory {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column()
  NameChanged!: boolean;

  @Column()
  IsActiveChanged!: boolean;

  @Column()
  isDeletedChange!: boolean;

  @Column()
  productId!: number;

  @CreateDateColumn()
  createAt!: Date;

  @ManyToOne(() => Product, (product) => product.history)
  @JoinColumn({ name: 'productId', referencedColumnName: 'id' })
  product!: Product;
}
