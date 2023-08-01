import AggregateRoot from "../../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../../@shared/domain/entity/base.entity";
import { Address } from "../../../@shared/domain/value-object/address.value-object";
import Id from "../../../@shared/domain/value-object/id.value-object";
import { Product } from "./product.entity";

export type InvoiceProps = {
  readonly id?: Id;
  readonly name: string;
  readonly document: string;
  readonly address: Address;
  readonly items: Product[];
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
};

export class Invoice extends BaseEntity implements AggregateRoot {
  private _name: string;
  private _document: string;
  private _address: Address;
  private _items: Product[];

  constructor(props: InvoiceProps) {
    const { id, name, document, address, items, createdAt, updatedAt } = props;
    super(id, createdAt, updatedAt);
    this._name = name;
    this._document = document;
    this._address = address;
    this._items = items;
  }

  get name(): string {
    return this._name;
  }

  get document(): string {
    return this._document;
  }

  get address(): Address {
    return this._address;
  }

  get items(): Product[] {
    return this._items;
  }

  get total(): number {
    return this._items
      .map((item) => item.price)
      .reduce((acc, value) => acc + value, 0);
  }
}
