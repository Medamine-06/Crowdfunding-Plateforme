import axios from 'axios';

const KONNECT_API_URL = 'https://api.sandbox.konnect.network/api/v2';
const KONNECT_API_KEY = import.meta.env.VITE_KONNECT_API_KEY;

export const paymentService = {
  // Initialize a payment
  async initializePayment(amount, projectId, donorInfo) {
    try {
      // Store projectId and amount in localStorage
      localStorage.setItem('current_project_id', projectId);
      localStorage.setItem('current_donation_amount', amount.toString());

      const response = await axios.post(
        `${KONNECT_API_URL}/payments/init-payment`,
        {
          receiverWalletId: "67a4bc9d5d9b58f3adf20287",
          token: "TND",
          amount: amount,
          type: "immediate",
          description: `Donation for project ${projectId}`,
          acceptedPaymentMethods: ["bank_card", "e-DINAR"],
          lifespan: 10,
          checkoutForm: true,
          addPaymentFeesToAmount: false,
          webhook: "http://localhost:5173/PaymentSuccess",
          silentWebhook: false,
          metadata: {
            projectId: projectId,
            type: "donation",
            timestamp: new Date().toISOString()
          }
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": KONNECT_API_KEY,
          },
        }
      );

      const result = response.data;
      console.log("Payment initialization response:", JSON.stringify(result, null, 2));

      if (result?.payUrl) {
        window.location.href = result.payUrl;
      } else {
        console.warn("Payment initialized, but no payUrl returned:", result);
      }

      return result;
    } catch (error) {
      console.error('Payment initialization error:', error.response?.data || error);
      throw error;
    }
  },

  // Verify payment status
  async verifyPayment(paymentId) {
    try {
      const response = await axios.get(
        `${KONNECT_API_URL}/payments/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${KONNECT_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Payment verification error:', error);
      throw error;
    }
  },
};