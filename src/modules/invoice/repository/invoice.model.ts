import {
  Column,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { ProductModel } from "./product.model";

@Table({
  tableName: "invoices",
  timestamps: false,
})
export class InvoiceModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  readonly id: string;

  @Column({ allowNull: false })
  readonly name: string;

  @Column({ allowNull: false })
  readonly document: string;

  @Column({ allowNull: false })
  readonly street: string;

  @Column({ allowNull: false })
  readonly number: string;

  @Column({ allowNull: false })
  readonly complement: string;

  @Column({ allowNull: false })
  readonly city: string;

  @Column({ allowNull: false })
  readonly state: string;

  @Column({ allowNull: false })
  readonly zipCode: string;

  @HasMany(() => ProductModel)
  readonly items: ProductModel[];

  @Column({ allowNull: false })
  readonly total: number;

  @Column({ allowNull: false })
  readonly createdAt: Date;

  @Column({ allowNull: false })
  readonly updatedAt: Date;
}
