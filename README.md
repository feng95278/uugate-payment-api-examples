# UUGate USDT / USDC 支付接口接入示例

[English](README.en.md) · [UUGate 官网](https://uugate.com/) · [API 文档](https://open.uugate.com/developers/) · [商户使用指南](https://cus.uugate.com/tutorials/?lang=zh-CN)

本资料由 UUGate 维护，面向需要将稳定币收款接入网站、会员充值或订单系统的开发者。内容包括网络选择、创建收款订单、回调验签和业务入账检查。示例只使用虚构数据；运行本仓库示例不会请求线上接口或创建订单。

## 支持的币种与网络

| 币种 | 支持网络 | 请求参数 | 产品说明 |
| --- | --- | --- | --- |
| USDT | TRON / TRC20 | `chainCode: TRON`, `tokenSymbol: USDT` | [USDT 收款与支付接口](https://uugate.com/usdt-payment-gateway/) |
| USDT | BNB Smart Chain / BEP20 | `chainCode: BSC`, `tokenSymbol: USDT` | 同上 |
| USDC | BNB Smart Chain / BEP20 | `chainCode: BSC`, `tokenSymbol: USDC` | [USDC 收款与支付接口](https://uugate.com/usdc-payment-gateway/) |
| USDC | Solana / SPL | `chainCode: SOL`, `tokenSymbol: USDC` | 同上 |

同一币种在不同网络上的地址与资产不能混用。当前支持范围不包含 TRC20-USDC、SPL-USDT 或 Bitcoin。UUGate 提供托管钱包能力，不能将其描述为非托管支付接口；方案和费用以[正式定价页](https://uugate.com/pricing/)为准。

## 选择收款模式

- **固定金额订单**：在服务端创建收款订单，将返回的收银台地址交给客户；通过订单查询与已验签回调确认结果。
- **会员充值**：可按稳定的业务绑定键创建独享钱包，将后续实际到账关联至会员。充值业务仍要核对币种、网络、到账状态并保证入账幂等。

接口入口见[创建收款订单](https://open.uugate.com/developers/create-payin-order.html)与[创建独享钱包](https://open.uugate.com/developers/bind-exclusive-wallet.html)。

## 创建收款订单：先看请求体

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

这只是请求体，不是可直接发送的完整请求。服务端还需提供 `x-api-key`、`x-merchant-uid`、`x-timestamp`、`x-nonce`、`x-signature` 五个认证头，并按官方规则规范化方法、路径、query 和 JSON 后计算签名。API Key 仅保存在商户服务端。[完整签名规则](https://open.uugate.com/developers/signing.html)

创建请求超时不能当作创建失败后无限重试；先核查订单结果，避免重复创建。客户单号本身不代表所有创建请求都具有幂等保证。[订单查询](https://open.uugate.com/developers/query-payin-order.html) · [返回码](https://open.uugate.com/developers/error-codes.html)

## 离线理解回调签名

本仓库的 [callback-signature-demo.mjs](examples/callback-signature-demo.mjs) 使用固定假数据演示：

1. 签名原文为 `timestamp.nonce.rawBody`。
2. 按创建原订单时的 API Key 计算 HMAC-SHA256。
3. 原始请求体的空格、字段顺序被改写后，签名校验应失败。

安装 Node.js 18 或更新版本后运行：

```bash
node examples/callback-signature-demo.mjs
```

程序使用 Node 内置模块，无需安装依赖；只打印五项本地检查结果。它演示 HMAC，不是生产接收服务。生产环境还需要时间窗口、重放防护、凭据轮换、业务核对和持久化幂等。[完整回调处理清单](docs/callback-processing.md) · [官方收款回调文档](https://open.uugate.com/developers/payin-callback.html)

## SDK 与操作教程

从[官方 SDK 下载页](https://open.uugate.com/developers/sdk-downloads.html)获取当前 Node.js、PHP / Laravel SDK；本资料库不冒充 npm 或 Composer 已发布包。

- [Node.js SDK 文档](https://open.uugate.com/developers/nodejs-sdk.html)
- [PHP / Laravel SDK 文档](https://open.uugate.com/developers/php-laravel-sdk.html)
- [USDT 收款接口接入流程](https://uugate.com/blog/posts/how-to-accept-usdt-payments.html)
- [WordPress 收款接入说明](https://uugate.com/blog/posts/accept-crypto-payments-wordpress.html)
- [独享钱包操作指南](https://cus.uugate.com/tutorials?article=exclusive-payment&lang=zh-CN)

示例与正式文档如有差异，以当前 API 文档和实际接口返回为准。接入问题可通过[官方联系入口](https://uugate.com/contact/)反馈；请勿在公开 issue 中提交 API Key、客户订单、个人信息或真实回调原文。
