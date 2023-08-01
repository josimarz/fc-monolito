import { Request, Response, Router } from "express";
import { InvoiceFacadeFactory } from "../../../modules/invoice/factory/facade.factory";

export const invoiceRouter = Router();

invoiceRouter.get("/:id", async (req: Request, res: Response) => {
  const facace = InvoiceFacadeFactory.create();
  try {
    const output = await facace.findInvoice({
      id: req.params.id,
    });
    res.status(200).send(output);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send({ message: error.message });
    }
  }
});
