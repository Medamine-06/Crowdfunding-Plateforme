import React, { useState } from 'react';
import { paymentService } from '../services/paymentService';
import { useAuth } from '../contexts/AuthContext'; // Assuming you have an auth context

const DonationForm = ({ project }) => {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDonation = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate amount
      const donationAmount = parseFloat(amount);
      if (isNaN(donationAmount) || donationAmount <= 0) {
        throw new Error('Please enter a valid amount');
      }

      // Prepare donor information
      const donorInfo = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || ''
      };

      // Initialize payment with Konnect
      const paymentResponse = await paymentService.initializePayment(
        donationAmount,
        project._id,
        donorInfo
      );

      // Redirect to Konnect payment page
      if (paymentResponse.redirectUrl) {
        window.location.href = paymentResponse.redirectUrl;
      } else {
        throw new Error('Failed to initialize payment');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while processing your donation');
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold mb-4">Make a Donation</h3>
      <form onSubmit={handleDonation}>
        <div className="mb-4">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
            Donation Amount (TND)
          </label>
          <div className="relative">
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
              placeholder="Enter amount"
              min="1"
              step="0.01"
              required
            />
            <span className="absolute right-3 top-2 text-gray-500">TND</span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          {loading ? 'Processing...' : 'Donate Now'}
        </button>
      </form>

      <div className="mt-4 text-sm text-gray-500">
        <p>Your donation will be processed securely through Konnect.</p>
        <p className="mt-1">All major credit cards and mobile payment methods are accepted.</p>
      </div>
    </div>
  );
};

export default DonationForm; 