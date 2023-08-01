import { Sequelize } from "sequelize-typescript";
import request from "supertest";
import { Umzug } from "umzug";
import ClientModel from "../../../modules/client-adm/repository/client.model";
import InvoiceModel from "../../../modules/invoice/repository/invoice.model";
import ProductModel from "../../../modules/invoice/repository/product.model";
import { migrator } from "../../db/sequelize/config/migrator";
import { app } from "../express";

describe("Invoice", () => {
  let sequelize: Sequelize;
  let migration: Umzug<Sequelize>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
    });
    sequelize.addModels([ClientModel, InvoiceModel, ProductModel]);

    migration = migrator(sequelize);
    await migration.up();
  });

  afterEach(async () => {
    await migration.down();
    await sequelize.close();
  });

  describe("/GET :id", () => {
    it("should get an invoice with the given id", async () => {
      const products: any[] = [
        {
          id: "ae076e6b-56fa-4f71-8ce1-c661b2bbd9c4",
          invoiceId: "c4f87cf4-f15c-4d08-8146-7c6aa6319c3d",
          name: "Apple notebook MacBook Pro",
          description:
            "(de 16 polegadas, Processador M1 Pro da Apple com CPU 10-core e GPU 16-core, 16 GB RAM, 512 GB SSD)",
          price: 22999.0,
          stock: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "eb919c58-e883-485b-8c64-aef12022004d",
          invoiceId: "c4f87cf4-f15c-4d08-8146-7c6aa6319c3d",
          name: "Notebook Apple MacBook Pro",
          description:
            "(de 13 polegadas, Processador M1 da Apple com CPU 8-core e GPU 8-core, 8 GB RAM, 256 GB)",
          price: 14398.8,
          stock: 8,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "074a67d0-e5f3-455f-ace6-3bd53dd0cdf0",
          invoiceId: "c4f87cf4-f15c-4d08-8146-7c6aa6319c3d",
          name: "Apple notebook MacBook Pro",
          description:
            "(de 14 polegadas, Processador M1 Pro da Apple com CPU 8-core e GPU 14-core, 16 GB RAM, 512 GB SSD)",
          price: 17999.0,
          stock: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const total = products.reduce((acc, item) => acc + item.price, 0);

      const invoice = {
        id: "c4f87cf4-f15c-4d08-8146-7c6aa6319c3d",
        name: "Zlatan Ibrahimovic",
        document: "677.403.207-90",
        street: "Rua Professor Waldemar Marques Pires",
        number: "321",
        complement: "",
        city: "Rio de Janeiro",
        state: "Rio de Janeiro",
        zipCode: "64600-007",
        total,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await InvoiceModel.create(invoice);
      await ProductModel.bulkCreate(products);

      const res = await request(app).get(`/invoice/${invoice.id}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.id).toBe(invoice.id);
      expect(res.body.name).toBe(invoice.name);
      expect(res.body.document).toBe(invoice.document);
      expect(res.body.address).toMatchObject({
        street: invoice.street,
        number: invoice.number,
        complement: invoice.complement,
        city: invoice.city,
        state: invoice.state,
        zipCode: invoice.zipCode,
      });
      expect(res.body.items).toHaveLength(products.length);
      expect(res.body.total).toBe(total);
    });
  });
});
