import { Invoice } from "../domain/entity/invoice.entity";

export interface InvoiceGateway {
  create(invoice: Invoice): Promise<void>;
  findById(id: string): Promise<Invoice>;
}
