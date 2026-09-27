// 离线教学数据；不是生产回调服务器，不读取环境变量，也不发送网络请求。
import assert from 'node:assert/strict';
import { createHmac, timingSafeEqual } from 'node:crypto';

const fakeKey = 'example_key_for_offline_test_only';
const timestamp = '1801000000000';
const nonce = 'example-nonce-not-for-production';
const rawBody = '{"orderNo":"EXAMPLE-ORDER-001","amount":"10.00"}';

function sign(body, key) {
  return createHmac('sha256', key)
    .update(`${timestamp}.${nonce}.${body}`, 'utf8')
    .digest('hex');
}

function signatureMatches(body, key, signature) {
  if (typeof signature !== 'string' || !/^[a-f0-9]{64}$/i.test(signature)) return false;
  const expected = Buffer.from(sign(body, key), 'hex');
  const supplied = Buffer.from(signature, 'hex');
  return timingSafeEqual(expected, supplied);
}

const signature = sign(rawBody, fakeKey);
assert.equal(signatureMatches(rawBody, fakeKey, signature), true);
assert.equal(signatureMatches(rawBody.replace('10.00', '99.00'), fakeKey, signature), false);
assert.equal(signatureMatches(JSON.stringify(JSON.parse(rawBody), null, 2), fakeKey, signature), false);
assert.equal(signatureMatches(rawBody, 'another_fake_key', signature), false);
assert.equal(signatureMatches(rawBody, fakeKey, 'not-a-valid-signature'), false);
console.log('PASS: valid signature, changed amount, changed whitespace, wrong key, malformed signature.');
console.log('Offline only. Production also needs timestamp checks, replay protection and durable order idempotency.');
