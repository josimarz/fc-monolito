import { Sequelize } from "sequelize-typescript";
import request from "supertest";
import { Umzug } from "umzug";
import { default as ClientModelCheckout } from "../../../modules/checkout/gateway/client.model";
import OrderModel from "../../../modules/checkout/gateway/order.model";
import { default as ProductModelCheckout } from "../../../modules/checkout/gateway/product.model";
import ClientModel from "../../../modules/client-adm/repository/client.model";
import InvoiceModel from "../../../modules/invoice/repository/invoice.model";
import { default as ProductModelInvoice } from "../../../modules/invoice/repository/product.model";
import TransactionModel from "../../../modules/payment/repository/transaction.model";
import { default as ProductModelAdmin } from "../../../modules/product-adm/repository/product.model";
import { default as ProductModelCatalog } from "../../../modules/store-catalog/repository/product.model";
import { migrator } from "../../db/sequelize/config/migrator";
import { app } from "../express";

describe("Checkout", () => {
  let sequelize: Sequelize;
  let migration: Umzug<Sequelize>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
    });
    sequelize.addModels([
      ClientModelCheckout,
      ProductModelCheckout,
      OrderModel,
      ClientModel,
      ProductModelAdmin,
      ProductModelCatalog,
      ProductModelInvoice,
      InvoiceModel,
      TransactionModel,
    ]);

    migration = migrator(sequelize);
    await migration.up();
  });

  afterEach(async () => {
    await migration.down();
    await sequelize.close();
  });

  describe("/POST checkout", () => {
    it("should place an order", async () => {
      const client = {
        id: "c4f87cf4-f15c-4d08-8146-7c6aa6319c3d",
        name: "Zlatan Ibrahimovic",
        email: "zlata@fifa.com",
        document: "677.403.207-90",
        street: "Rua Professor Waldemar Marques Pires",
        number: "321",
        complement: "",
        city: "Rio de Janeiro",
        state: "Rio de Janeiro",
        zipCode: "64600-007",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await ClientModel.create(client);

      const products: any[] = [
        {
          id: "ae076e6b-56fa-4f71-8ce1-c661b2bbd9c4",
          name: "Apple notebook MacBook Pro",
          description:
            "(de 16 polegadas, Processador M1 Pro da Apple com CPU 10-core e GPU 16-core, 16 GB RAM, 512 GB SSD)",
          purchasePrice: 20988.0,
          salesPrice: 22999.0,
          stock: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "eb919c58-e883-485b-8c64-aef12022004d",
          name: "Notebook Apple MacBook Pro",
          description:
            "(de 13 polegadas, Processador M1 da Apple com CPU 8-core e GPU 8-core, 8 GB RAM, 256 GB)",
          purchasePrice: 12988.0,
          salesPrice: 14398.8,
          stock: 8,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "074a67d0-e5f3-455f-ace6-3bd53dd0cdf0",
          name: "Apple notebook MacBook Pro",
          description:
            "(de 14 polegadas, Processador M1 Pro da Apple com CPU 8-core e GPU 14-core, 16 GB RAM, 512 GB SSD)",
          purchasePrice: 16544.0,
          salesPrice: 17999.0,
          stock: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      await ProductModelAdmin.bulkCreate(products);

      const total = products.reduce((acc, item) => acc + item.salesPrice, 0);

      const res = await request(app)
        .post("/checkout")
        .send({
          clientId: client.id,
          products: products.map((product) => product.id),
        });
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("id");
      expect(res.body).toHaveProperty("invoiceId");
      expect(res.body).toHaveProperty("status");
      expect(res.body).toHaveProperty("total");
      expect(res.body).toHaveProperty("products");
      expect(res.body.total).toBe(total);
      expect(res.body.products).toHaveLength(products.length);
    });
  });
});
