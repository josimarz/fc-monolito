import Id from "../../@shared/domain/value-object/id.value-object";
import { Invoice } from "../domain/entity/invoice.entity";
import { Product } from "../domain/entity/product.entity";
import { Address } from "../domain/value-object/address.value-object";
import { InvoiceGateway } from "../gateway/invoice.gateway";
import { InvoiceModel } from "./invoice.model";
import { ProductModel } from "./product.model";

export class InvoiceRepository implements InvoiceGateway {
  async create(invoice: Invoice): Promise<void> {
    await InvoiceModel.create(
      {
        id: invoice.id.id,
        name: invoice.name,
        document: invoice.document,
        street: invoice.address.street,
        number: invoice.address.number,
        complement: invoice.address.complement,
        city: invoice.address.city,
        state: invoice.address.state,
        zipCode: invoice.address.zipCode,
        items: invoice.items.map((item) => ({
          id: item.id.id,
          name: item.name,
          price: item.price,
        })),
        total: invoice.total,
        createdAt: invoice.createdAt,
        updatedAt: invoice.updatedAt,
      },
      {
        include: [ProductModel],
      }
    );
  }

  async findById(id: string): Promise<Invoice> {
    const item = await InvoiceModel.findByPk(id, {
      include: [ProductModel],
    });
    if (!item) {
      throw new Error(`Invoice with id ${id} not found`);
    }
    return new Invoice({
      id: new Id(item.id),
      name: item.name,
      document: item.document,
      address: new Address({
        street: item.street,
        number: item.number,
        complement: item.complement,
        city: item.city,
        state: item.state,
        zipCode: item.zipCode,
      }),
      items: item.items.map(
        (item) =>
          new Product({
            id: new Id(item.id),
            name: item.name,
            price: item.price,
          })
      ),
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    });
  }
}
