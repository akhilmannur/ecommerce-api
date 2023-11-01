const verifyWebhookSignature = (secret, payload, signature) => {
    const expectedSignature = `sha1=${crypto
      .createHmac('sha1', secret)
      .update(payload)
      .digest('hex')}`;
  
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  }

module.exports = verifyWebhookSignature