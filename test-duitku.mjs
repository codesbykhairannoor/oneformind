import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

async function testDuitkuDomain(domain) {
    const merchantCode = process.env.DUITKU_MERCHANT_CODE || '';
    const apiKey = process.env.DUITKU_API_KEY || '';
    
    if (!merchantCode || !apiKey) {
        console.log("Duitku credentials missing in .env");
        return;
    }

    const orderId = `TEST-${Date.now()}`;
    const amount = 50000;
    const timestamp = Date.now();
    const signaturePlain = `${merchantCode}${timestamp}${apiKey}`;
    const signature = crypto.createHash('sha256').update(signaturePlain).digest('hex');

    const callbackUrl = `https://${domain}/api/payment/duitku/callback`;
    const returnUrl = `https://${domain}/payment/status?ref=${orderId}`;

    const payload = {
        merchantCode,
        paymentAmount: amount,
        merchantOrderId: orderId,
        productDetails: 'Test Domain Rebrand',
        email: 'test@tranvas.com',
        customerVaName: 'Test User',
        callbackUrl,
        returnUrl,
        signature,
        timestamp: timestamp.toString()
    };

    console.log(`Testing Duitku with domain: ${domain}...`);

    try {
        const response = await fetch('https://api-prod.duitku.com/api/merchant/createInvoice', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-duitku-signature': signature,
                'x-duitku-timestamp': timestamp.toString(),
                'x-duitku-merchantcode': merchantCode
            },
            body: JSON.stringify(payload)
        });

        const text = await response.text();
        console.log(`Response for ${domain}:`, text);
    } catch (e) {
        console.error("Error calling Duitku:", e);
    }
}

async function main() {
    await testDuitkuDomain('oneformind.com');
    console.log("-----------------------------------------");
    await testDuitkuDomain('tranvas.com');
}

main();
