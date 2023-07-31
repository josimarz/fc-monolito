import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { InvoiceModel } from "./invoice.model";

@Table({
  tableName: "products",
  timestamps: false,
})
export class ProductModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  readonly id: string;

  @ForeignKey(() => InvoiceModel)
  @Column({ allowNull: false })
  readonly invoiceId: string;

  @BelongsTo(() => InvoiceModel)
  readonly invoice: InvoiceModel;

  @Column({ allowNull: false })
  readonly name: string;

  @Column({ allowNull: false })
  readonly price: number;
}
