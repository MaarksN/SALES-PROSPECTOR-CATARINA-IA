import {
  BadRequestException,
  Controller,
  Headers,
  Post,
} from "@nestjs/common";
import { createHmac, timingSafeEqual } from "crypto";
import { WalletService } from "./wallet.service";
import { RawBody } from "../common/decorators/raw-body.decorator";

@Controller("stripe")
export class StripeController {
  constructor(private wallet: WalletService) {}

  @Post("webhook")
  async handleWebhook(
    @Headers("stripe-signature") signature: string,
    @RawBody() rawBody: Buffer,
  ) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new BadRequestException("Missing STRIPE_WEBHOOK_SECRET");
    }

    const sigHeader = signature?.split(",").find((part) => part.startsWith("v1="));
    const providedSignature = sigHeader?.replace("v1=", "");
    if (!providedSignature || !rawBody) {
      throw new BadRequestException("Invalid Stripe signature header");
    }

    const computedSignature = createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    const computedBuffer = Buffer.from(computedSignature, "utf8");
    const providedBuffer = Buffer.from(providedSignature, "utf8");

    if (computedBuffer.length !== providedBuffer.length) {
      throw new BadRequestException("Invalid Stripe signature");
    }

    const isValid = timingSafeEqual(computedBuffer, providedBuffer);

    if (!isValid) {
      throw new BadRequestException("Invalid Stripe signature");
    }

    const body = JSON.parse(rawBody.toString("utf8"));

    if (body.type === "invoice.paid") {
      const orgId = body.data.object.metadata.orgId;
      const amount = body.data.object.amount_paid / 100;
      // In a real app, we'd add credit, not decrement
      console.log(`Payment received for ${orgId}: ${amount}`);
    }
    return { received: true };
  }
}
