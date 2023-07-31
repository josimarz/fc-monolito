import Id from "../../../@shared/domain/value-object/id.value-object";
import { Invoice } from "../../domain/entity/invoice.entity";
import { Product } from "../../domain/entity/product.entity";
import { Address } from "../../domain/value-object/address.value-object";
import {
  FindInvoiceUseCaseInputDTO,
  FindInvoiceUseCaseOutputDTO,
} from "./find-invoice.dto";
import { FindInvoiceUseCase } from "./find-invoice.usecase";

const address = new Address({
  street: "Rua Centenário",
  number: "400",
  complement: "",
  city: "Blumenau",
  state: "Santa Catarina",
  zipCode: "89023-600",
});

const items: Product[] = [
  new Product({
    name: 'Monitor LG Ultrawide 29WL500-29"',
    price: 1198.0,
  }),
  new Product({
    name: "Teclado sem fio Logitech",
    price: 719.99,
  }),
  new Product({
    name: "Novo Echo Dot 5ª geração",
    price: 407.55,
  }),
];

const invoice = new Invoice({
  id: new Id("50f7e65f-c82e-4537-88d4-80e4252df395"),
  name: "Josimar Zimermann",
  document: "99098337",
  address,
  items,
});

const repositoryMock = {
  create: jest.fn().mockReturnThis(),
  findById: jest.fn().mockResolvedValue(invoice),
};

describe("FindInvoiceUseCase", () => {
  let useCase: FindInvoiceUseCase;

  beforeEach(() => {
    useCase = new FindInvoiceUseCase(repositoryMock);
  });

  it("should be defined", () => {
    expect(useCase).toBeDefined();
  });

  describe("execute", () => {
    it("should return an invoice with the given id", async () => {
      const input: FindInvoiceUseCaseInputDTO = {
        id: invoice.id.id,
      };

      const output: FindInvoiceUseCaseOutputDTO = {
        id: invoice.id.id,
        name: invoice.name,
        document: invoice.document,
        address: {
          street: invoice.address.street,
          number: invoice.address.number,
          complement: invoice.address.complement,
          city: invoice.address.city,
          state: invoice.address.state,
          zipCode: invoice.address.zipCode,
        },
        items: invoice.items.map((item) => ({
          id: item.id.id,
          name: item.name,
          price: item.price,
        })),
        total: invoice.total,
        createdAt: invoice.createdAt,
      };

      await expect(useCase.execute(input)).resolves.toMatchObject(output);
      expect(repositoryMock.findById).toHaveBeenCalledTimes(1);
    });
  });
});
