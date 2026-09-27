# UUGate payment API integration examples

[中文](README.md) · [Website](https://uugate.com/en-US/) · [API documentation](https://open.uugate.com/developers/en-US/index.html)

Maintained by UUGate. This guide helps developers connect USDT and USDC collection to order systems and member top-ups. It covers network selection, order creation, callback signatures and reliable fulfillment. All local examples use fictional data and make no network requests.

## Supported combinations

| Asset | Network | API values |
| --- | --- | --- |
| USDT | TRON / TRC20 | `TRON`, `USDT` |
| USDT | BNB Smart Chain / BEP20 | `BSC`, `USDT` |
| USDC | BNB Smart Chain / BEP20 | `BSC`, `USDC` |
| USDC | Solana / SPL | `SOL`, `USDC` |

An asset name alone does not identify a payment network. Do not substitute an unsupported combination. UUGate provides custodial wallet functionality; the service is not described as a non-custodial payment system. See the current [USDT](https://uugate.com/en-US/usdt-payment-gateway/), [USDC](https://uugate.com/en-US/usdc-payment-gateway/) and [pricing](https://uugate.com/en-US/pricing/) pages for product scope and fees.

## Connect an order system

1. Select the asset and network your checkout will accept.
2. Create a fixed-amount payment order on your server, keeping the API Key out of browser code.
3. Persist the platform order number and the association with your own business order. Store enough information to identify the original authentication credential after key rotation.
4. Give the customer the returned cashier URL. A browser redirect is not evidence that the payment has completed.
5. Verify callback signatures, check the payment facts, and fulfill the business order exactly once using durable transaction handling.
6. Reconcile uncertain states using the order query API. Do not blindly create another order after a timeout.

For member top-ups, consider a dedicated wallet binding instead of asking the customer to choose an amount in advance. See [dedicated wallet creation](https://open.uugate.com/developers/en-US/bind-exclusive-wallet.html).

### Example request body

`POST https://api.uugate.com/openapi/payin/orders`

```json
{
  "chainCode": "TRON",
  "tokenSymbol": "USDT",
  "merchantOrderNo": "EXAMPLE-ORDER-001",
  "amount": "10.00",
  "notifyUrl": "https://merchant.example.com/payments/uugate"
}
```

This is a body example, not a complete authenticated request. The API requires `x-api-key`, `x-merchant-uid`, `x-timestamp`, `x-nonce` and `x-signature`. Follow the [request signing specification](https://open.uugate.com/developers/en-US/signing.html) for canonical paths, query strings and JSON. See [create order](https://open.uugate.com/developers/en-US/create-payin-order.html), [query order](https://open.uugate.com/developers/en-US/query-payin-order.html) and [error codes](https://open.uugate.com/developers/en-US/error-codes.html).

## Run the offline callback demonstration

```bash
node examples/callback-signature-demo.mjs
```

Requires Node.js 18 or newer, with no external dependencies. The demonstration uses the HMAC-SHA256 message `timestamp.nonce.rawBody` and a fictional key. Five checks cover a valid signature, an altered amount, changed JSON whitespace, a wrong key and a malformed signature. Nothing is sent to UUGate.

This example only demonstrates signature comparison. A production receiver must also enforce an appropriate timestamp window, replay protection, original-order credential lookup and durable business idempotency. Use the [callback checklist](docs/callback-processing.md) and [official callback documentation](https://open.uugate.com/developers/en-US/payin-callback.html).

## SDKs and help

- [Official SDK downloads](https://open.uugate.com/developers/en-US/sdk-downloads.html)
- [Node.js SDK](https://open.uugate.com/developers/en-US/nodejs-sdk.html)
- [PHP / Laravel SDK](https://open.uugate.com/developers/en-US/php-laravel-sdk.html)
- [Merchant tutorials](https://cus.uugate.com/tutorials/?lang=en-US)
- [Integration support](https://uugate.com/en-US/contact/)

This repository is an integration guide, not a published npm or Composer package. Do not put API Keys, customer information or real callback bodies in public issues. The current official documentation and API responses take precedence if an example becomes outdated.
