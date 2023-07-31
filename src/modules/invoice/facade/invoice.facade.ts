import { FindInvoiceUseCase } from "../usecase/find-invoice/find-invoice.usecase";
import { GenerateInvoiceUseCase } from "../usecase/generate-invoice/generate-invoice.usecase";
import {
  FindInvoiceFacadeInputDTO,
  FindInvoiceFacadeOutputDTO,
  GenerateInvoiceFacadeInputDto,
  GenerateInvoiceFacadeOutputDto,
  InvoiceFacadeInterface,
} from "./invoice-facade.interface";

type InvoiceFacadeProps = {
  readonly findInvoiceUseCase: FindInvoiceUseCase;
  readonly generateInvoiceUseCase: GenerateInvoiceUseCase;
};

export class InvoiceFacade implements InvoiceFacadeInterface {
  private readonly findInvoiceUseCase: FindInvoiceUseCase;
  private readonly generateInvoiceUseCase: GenerateInvoiceUseCase;

  constructor(props: InvoiceFacadeProps) {
    this.findInvoiceUseCase = props.findInvoiceUseCase;
    this.generateInvoiceUseCase = props.generateInvoiceUseCase;
  }

  findInvoice(
    input: FindInvoiceFacadeInputDTO
  ): Promise<FindInvoiceFacadeOutputDTO> {
    return this.findInvoiceUseCase.execute(input);
  }

  generateInvoice(
    input: GenerateInvoiceFacadeInputDto
  ): Promise<GenerateInvoiceFacadeOutputDto> {
    return this.generateInvoiceUseCase.execute(input);
  }
}
