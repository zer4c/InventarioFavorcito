import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ unique: true })
  name!: string;

  @Column()
  isActive!: boolean;

  @Column()
  stock!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => ProductHistory, (history) => history.product)
  history! : ProductHistory[]

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
  stockChanged!: boolean;

  @CreateDateColumn()
  createAt!: Date;

  @ManyToOne(() => Product, (product) => product.history)
  product!: Product

}
