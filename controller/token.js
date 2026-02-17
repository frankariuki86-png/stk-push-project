const axios = require('axios');

// ====================
// CREATE TOKEN
// ====================
const createToken = async (req, res, next) => {
  try {
    console.log("🚀 createToken called");

    const consumerKey = process.env.MPESA_CONSUMER_KEY;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

    const response = await axios.get(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      { headers: { Authorization: `Basic ${auth}` } }
    );

    req.access_token = response.data.access_token;
    console.log("✅ ACCESS TOKEN:", req.access_token);

    next();
  } catch (error) {
    console.log("❌ ERROR GENERATING TOKEN:", error.response?.data || error.message);
    res.status(500).send('Error generating token');
  }
};

// ====================
// STK PUSH
// ====================
const stkPush = async (req, res) => {
  try {
    console.log("🚀 stkPush called");

    const shortCode = process.env.MPESA_SHORTCODE;
    const passkey = process.env.MPESA_PASSKEY;

    const phoneNumber = req.body.phoneNumber.replace(/^0/, "254");
    const amount = Number(req.body.amount);

    const timestamp = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);
    const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString('base64');

    const data = {
      BusinessShortCode: shortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: phoneNumber,
      PartyB: shortCode,
      PhoneNumber: phoneNumber,
      CallBackURL: "https://webhook.site/YOUR-UNIQUE-URL",
      AccountReference: "Test123",
      TransactionDesc: "testing stk push"
    };

    console.log("PHONE:", phoneNumber, "AMOUNT:", amount);
    console.log("STK PUSH DATA:", JSON.stringify(data, null, 2));

    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      data,
      { headers: { Authorization: `Bearer ${req.access_token}` } }
    );

    console.log("✅ STK RESPONSE:", JSON.stringify(response.data, null, 2));
    res.json(response.data);
  } catch (error) {
    console.log("❌ ERROR RESPONSE:", error.response?.data || error.message);
    res.status(500).send('Error processing STK Push');
  }
};

module.exports = { createToken, stkPush };
