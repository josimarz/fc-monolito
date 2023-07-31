import { Sequelize } from "sequelize-typescript";
import { InvoiceFacadeFactory } from "../factory/facade.factory";
import { InvoiceModel } from "../repository/invoice.model";
import { ProductModel } from "../repository/product.model";
import {
  FindInvoiceFacadeInputDTO,
  GenerateInvoiceFacadeInputDto,
  InvoiceFacadeInterface,
} from "./invoice-facade.interface";

describe("InvoiceFacade", () => {
  let facade: InvoiceFacadeInterface;
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

    facade = InvoiceFacadeFactory.create();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should be defined", () => {
    expect(facade).toBeDefined();
  });

  describe("findInvoice", () => {
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

      const input: FindInvoiceFacadeInputDTO = {
        id: model.id,
      };

      const output = await facade.findInvoice(input);
      const items: any[] = model.toJSON().items;

      expect(output.id).toBe(model.id);
      expect(output.name).toBe(model.name);
      expect(output.document).toBe(model.document);
      expect(output.address.street).toBe(model.street);
      expect(output.address.number).toBe(model.number);
      expect(output.address.complement).toBe(model.complement);
      expect(output.address.city).toBe(model.city);
      expect(output.address.state).toBe(model.state);
      expect(output.address.zipCode).toBe(model.zipCode);
      expect(output.total).toBe(model.total);
      expect(output.items).toMatchObject(
        expect.arrayContaining(
          items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
          }))
        )
      );
    });

    it("should throws an exception due to unable to find an invoice with the given id", async () => {
      const id = "0bcca42f-b4e9-4435-8270-c5044c66ffcd";
      await expect(facade.findInvoice({ id })).rejects.toThrow(
        `Invoice with id ${id} not found`
      );
    });
  });

  describe("generateInvoice", () => {
    it("should generate a new invoice for the given input", async () => {
      const input: GenerateInvoiceFacadeInputDto = {
        name: "Josimar Zimermann",
        document: "8893837002",
        street: "Rua Centenário",
        number: "400",
        complement: "",
        city: "Blumenau",
        state: "Santa Catarina",
        zipCode: "89023-600",
        items: [
          {
            id: "1e1930d6-1d1b-4cdc-9f66-b578d6e88ac2",
            name: "Kindle Paperwhite Signature Edition 32 GB",
            price: 854.05,
          },
          {
            id: "028ae68f-0ad0-4f66-95d0-6210508dd48b",
            name: "Capa de cortiça para Novo Kindle Paperwhite",
            price: 249.0,
          },
          {
            id: "b449c084-83de-4f32-9dd0-5cf9d4a5c476",
            name: "Adaptador de energia",
            price: 99.0,
          },
        ],
      };

      const output = await facade.generateInvoice(input);

      expect(output.id).toBeDefined();
      expect(output.name).toBe(input.name);
      expect(output.document).toBe(input.document);
      expect(output.street).toBe(input.street);
      expect(output.number).toBe(input.number);
      expect(output.complement).toBe(input.complement);
      expect(output.city).toBe(input.city);
      expect(output.state).toBe(input.state);
      expect(output.zipCode).toBe(input.zipCode);
      expect(output.items).toMatchObject(input.items);
      expect(output.total).toBe(854.05 + 249.0 + 99.0);
    });
  });
});
