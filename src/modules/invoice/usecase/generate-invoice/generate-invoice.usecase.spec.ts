import { GenerateInvoiceUseCaseInputDto } from "./generate-invoice.dto";
import { GenerateInvoiceUseCase } from "./generate-invoice.usecase";

const repositoryMock = {
  create: jest.fn().mockResolvedValue(void 0),
  findById: jest.fn().mockReturnThis(),
};

describe("GenerateInvoiceUseCase", () => {
  let useCase: GenerateInvoiceUseCase;

  beforeEach(() => {
    useCase = new GenerateInvoiceUseCase(repositoryMock);
  });

  it("should be defined", () => {
    expect(useCase).toBeDefined();
  });

  describe("execute", () => {
    it("should generate a new invoice for the given input", async () => {
      const input: GenerateInvoiceUseCaseInputDto = {
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

      const output = await useCase.execute(input);

      expect(repositoryMock.create).toHaveBeenCalledTimes(1);
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
