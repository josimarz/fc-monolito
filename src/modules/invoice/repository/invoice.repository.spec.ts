import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/value-object/id.value-object";
import { Invoice } from "../domain/entity/invoice.entity";
import { Product } from "../domain/entity/product.entity";
import { Address } from "../domain/value-object/address.value-object";
import { InvoiceModel } from "./invoice.model";
import { InvoiceRepository } from "./invoice.repository";
import { ProductModel } from "./product.model";

describe("InvoiceRepository", () => {
  let repository: InvoiceRepository;
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([InvoiceModel, ProductModel]);
    await sequelize.sync();

    repository = new InvoiceRepository();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should be defined", () => {
    expect(repository).toBeDefined();
  });

  describe("create", () => {
    it("should create an invoice", async () => {
      const items: Product[] = [
        new Product({
          id: new Id("a1bf4524-629a-49cf-9db7-f4b53369d4e1"),
          name: "Chá Preto",
          price: 17.09,
        }),
        new Product({
          id: new Id("fee34047-25ad-4cdc-aff2-4d874e17fbbd"),
          name: "Chá Misto Camomila, Mel e Baunilha 15G - Caixa com 10 Unid",
          price: 15.87,
        }),
        new Product({
          id: new Id("d7c14b2b-9001-478a-9467-8961422a044f"),
          name: "Chá Misto de Limão e Gengibre Twinings com 10 Saquinhos",
          price: 15.87,
        }),
      ];

      const invoice = new Invoice({
        id: new Id("94c6e5b1-50a3-44ae-a6ba-c6cffc90a40d"),
        name: "Josimar Zimermann",
        document: "2023073100123",
        address: new Address({
          street: "Rua Centenário",
          number: "400",
          complement: "",
          city: "Blumenau",
          state: "Santa Catarina",
          zipCode: "89023-600",
        }),
        items,
      });

      await expect(repository.create(invoice)).resolves.not.toThrow();

      const output = await InvoiceModel.findByPk(
        "94c6e5b1-50a3-44ae-a6ba-c6cffc90a40d",
        { include: [ProductModel] }
      );

      expect(output.id).toBe(invoice.id.id);
      expect(output.name).toBe(invoice.name);
      expect(output.document).toBe(invoice.document);
      expect(output.street).toBe(invoice.address.street);
      expect(output.number).toBe(invoice.address.number);
      expect(output.complement).toBe(invoice.address.complement);
      expect(output.city).toBe(invoice.address.city);
      expect(output.state).toBe(invoice.address.state);
      expect(output.zipCode).toBe(invoice.address.zipCode);
      expect(output.toJSON().items).toEqual(
        expect.arrayContaining(
          items.map((item) => ({
            id: item.id.id,
            invoiceId: invoice.id.id,
            name: item.name,
            price: item.price,
          }))
        )
      );
    });
  });

  describe("findById", () => {
    it("should find an invoice with the given id", async () => {
      const model = await InvoiceModel.create(
        {
          id: "0ae35b45-7673-4132-925b-ad19bc6033d9",
          name: "Josimar Zimermann",
          document: "202307319928",
          street: "Rua Centenário",
          number: "400",
          complement: "",
          city: "Blumenau",
          state: "Santa Catarina",
          zipCode: "89023-600",
          items: [
            {
              id: "c51994e5-3b21-4576-a9c5-195ac39fef00",
              name: "O sol é para todos",
              price: 41.99,
            },
            {
              id: "cc428903-78d7-4b49-b5a8-e4bce59d4807",
              name: "A Biblioteca da Meia-Noite",
              price: 41.9,
            },
            {
              id: "95e0b2f7-0a3d-4763-b280-a47b8797b861",
              name: "É assim que começa",
              price: 34.9,
            },
          ],
          total: 41.99 + 41.9 + 34.9,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        { include: [ProductModel] }
      );

      const invoice = await repository.findById(model.id);

      expect(invoice.id.id).toBe(model.id);
      expect(invoice.name).toBe(model.name);
      expect(invoice.document).toBe(model.document);
      expect(invoice.address.street).toBe(model.street);
      expect(invoice.address.number).toBe(model.number);
      expect(invoice.address.complement).toBe(model.complement);
      expect(invoice.address.city).toBe(model.city);
      expect(invoice.address.state).toBe(model.state);
      expect(invoice.address.zipCode).toBe(model.zipCode);
      expect(invoice.total).toBe(model.total);
      expect(
        invoice.items.map((item) => ({
          id: item.id.id,
          invoiceId: invoice.id.id,
          name: item.name,
          price: item.price,
        }))
      ).toMatchObject(expect.arrayContaining(model.toJSON().items));
    });

    it("should throws an exception due to unable to find an invoice with the given id", async () => {
      const id = "0bcca42f-b4e9-4435-8270-c5044c66ffcd";
      await expect(repository.findById(id)).rejects.toThrow(
        `Invoice with id ${id} not found`
      );
    });
  });
});
