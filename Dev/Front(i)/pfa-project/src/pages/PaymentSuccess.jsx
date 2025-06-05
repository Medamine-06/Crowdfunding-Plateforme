import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { paymentService } from '../services/paymentService';
import { projectService } from '../services/api';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const paymentRef = searchParams.get('payment_ref');
        console.log("Payment Reference from URL:", paymentRef);

        if (!paymentRef) {
          throw new Error('Payment reference (payment_ref) not found in URL');
        }

        console.log("Attempting to verify payment with reference:", paymentRef);

        const paymentStatus = await paymentService.verifyPayment(paymentRef);
        console.log("Raw paymentStatus response:", JSON.stringify(paymentStatus, null, 2));

        // Access nested status inside payment
        const status = paymentStatus?.payment?.status;

        if (!status) {
          throw new Error('Payment verification returned no status');
        }

        if (status.toLowerCase() === 'success' || 
            status.toLowerCase() === 'accepted' || 
            status.toLowerCase() === 'completed') {
          console.log("Payment successful. Redirecting...");

          // Get projectId and amount from localStorage
          const projectId = localStorage.getItem('current_project_id');
          const amount = localStorage.getItem('current_donation_amount');
          console.log("Retrieved projectId from localStorage:", projectId);
          console.log("Retrieved amount from localStorage:", amount);

          if (projectId && amount) {
            try {
              // Update project amount
              const updatedProject = await projectService.updateProjectAmount(projectId, parseFloat(amount));
              console.log("Project updated successfully:", {
                amount: updatedProject.currentAmount,
                backers: updatedProject.backers,
                project: updatedProject
              });

              // Clean up localStorage
              localStorage.removeItem('current_project_id');
              localStorage.removeItem('current_donation_amount');
              
              // Store donation success in localStorage to show success message on project page
              localStorage.setItem('donation_success', JSON.stringify({
                amount: amount,
                timestamp: new Date().toISOString()
              }));
              
              setTimeout(() => {
                navigate('/projects/' + projectId);
              }, 3000);
            } catch (updateError) {
              console.error("Error updating project:", updateError);
              setError("Payment successful, but failed to update project.");
              setVerifying(false);
            }
          } else {
            console.warn("Project ID or amount not found in localStorage. Cannot update project.");
            setError("Payment successful, but could not find project details for update.");
            setVerifying(false);
          }
        } else {
          console.warn("Payment status is not SUCCESS:", status);
          throw new Error(`Payment verification failed. Status: ${status}`);
        }
      } catch (err) {
        console.error("Error in PaymentSuccess component:", err);
        setError(err.message);
        setVerifying(false);
      }
    };

    const timer = setTimeout(() => {
      verifyPayment();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchParams, navigate]);

  // ... rest of the component remains the same ...
};

export default PaymentSuccess;