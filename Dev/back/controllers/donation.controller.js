const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/initiate-donation", async (req, res) => {
  try {
    const { amount, projectId } = req.body;

    const response = await axios.post(
      "https://api.preprod.konnect.network/api/v2/payments/init-payment",
      {
        receiverWalletId: "6818ee20ffbfb58e43bcd97a",
        amount: amount * 1000, // in millimes
        token: "TND",
        type: "immediate",
        description: `Donation to project ${projectId}`,
        orderId: `donation_${Date.now()}`,
        webhook: "https://yourdomain.com/api/webhook",
        successUrl: "https://yourfrontend.com/success",
        failUrl: "https://yourfrontend.com/fail",
        acceptedPaymentMethods: ["bank_card", "e-DINAR"],
        checkoutForm: true,
      },
      {
        headers: {
          "x-api-key": "6818ee1dffbfb58e43bcd904:LZdQJtWrDAuBlGIqQ9icHsbPnDiu",
        },
      }
    );

    res.status(200).send({ url: response.data.payUrl });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).send({ message: "Payment initiation failed" });
  }
});

module.exports = router;
