const axios = require("axios");
const Donation = require("./models/Donation.model");
const Project = require("./models/Project.model");

module.exports = (server) => {
    // Initiate donation payment with Konnect
    server.post("/initiate-donation", async (req, res) => {
        try {
            const { amount, projectId } = req.body;

            const response = await axios.post(
                "https://api.preprod.konnect.network/api/v2/payments/init-payment",
                {
                    receiverWalletId: "6818ee20ffbfb58e43bcd97a",
                    amount: amount * 1000, // Convert TND to millimes
                    token: "TND",
                    type: "immediate",
                    description: `Donation to project ${projectId}`,
                    orderId: `donation_${Date.now()}`,
                    webhook: "http://localhost:3000/konnect/webhook", // Update to your backend URL
                    successUrl: "http://localhost:5173/PaymentSuccess", // Update to your frontend URL
                    failUrl: "http://localhost:5173/PaymentFailed",
                    acceptedPaymentMethods: ["bank_card", "e-DINAR"],
                    checkoutForm: true,
                    metadata: {
                        projectId: projectId,
                        amount: amount
                    }
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

    // Webhook handler for Konnect payment notifications
    server.post("/konnect/webhook", async (req, res) => {
        const { payment_ref } = req.body;

        try {
            const response = await axios.get(
                `https://api.preprod.konnect.network/api/v2/payments/${payment_ref}`,
                {
                    headers: {
                        "x-api-key": "6818ee1dffbfb58e43bcd904:LZdQJtWrDAuBlGIqQ9icHsbPnDiu",
                    },
                }
            );

            const payment = response.data;

            if (payment.status === "completed") {
                // Extract project ID and amount from metadata
                const projectId = payment.metadata?.projectId;
                const amount = payment.metadata?.amount;

                if (projectId && amount) {
                    try {
                        // Create donation record
                        const donation = await Donation.create({
                            amount: amount,
                            project: projectId,
                            status: 'paid',
                            paymentId: payment_ref
                        });

                        // Update project's current amount and increment backers count
                        const updatedProject = await Project.findByIdAndUpdate(
                            projectId,
                            { 
                                $inc: { 
                                    currentAmount: amount,
                                    backers: 1  // Increment backers count by 1
                                }
                            },
                            { new: true }
                        );

                        console.log("✅ Donation confirmed and recorded:", {
                            donation,
                            payment,
                            updatedProject
                        });
                    } catch (dbError) {
                        console.error("Database error:", dbError);
                        // Still return 200 to Konnect to prevent retries
                        return res.status(200).send("Webhook processed with database errors");
                    }
                } else {
                    console.warn("Missing projectId or amount in payment metadata");
                }
            }

            res.status(200).send("Webhook processed");
        } catch (err) {
            console.error("Webhook error:", err.message);
            res.status(500).send("Error processing webhook");
        }
    });

    // Endpoint to handle donation amount update
    server.patch("/projects/:id/donate", async (req, res) => {
        try {
            const { id } = req.params;
            const { amount } = req.body;
            
            console.log('Received donation update request:', { id, amount });

            // Validate amount
            if (!amount || isNaN(amount) || amount <= 0) {
                console.log('Invalid amount:', amount);
                return res.status(400).json({ message: 'Invalid donation amount' });
            }

            // Update project's current amount and increment backers count
            const project = await Project.findByIdAndUpdate(
                id,
                { 
                    $inc: { 
                        currentAmount: amount,
                        backers: 1  // Increment backers count by 1
                    }
                },
                { new: true }
            );

            if (!project) {
                console.log('Project not found:', id);
                return res.status(404).json({ message: 'Project not found' });
            }

            console.log('Project updated successfully:', project);
            res.json({
                message: 'Donation recorded successfully',
                project: project
            });
        } catch (error) {
            console.error('Error updating project amount:', error);
            res.status(500).json({ message: 'Error updating project amount' });
        }
    });

    // Get all donations for a project
    server.get("/project/:projectId", async (req, res) => {
        try {
            const { projectId } = req.params;
            const donations = await Donation.find({ project: projectId })
                .sort({ createdAt: -1 })
                .populate('donor', 'firstName lastName email');
            
            res.json(donations);
        } catch (error) {
            console.error('Error fetching donations:', error);
            res.status(500).json({ message: 'Error fetching donations' });
        }
    });

    // Get donation statistics for a project
    server.get("/stats/:projectId", async (req, res) => {
        try {
            const { projectId } = req.params;
            
            const stats = await Donation.aggregate([
                { $match: { project: projectId, status: 'paid' } },
                {
                    $group: {
                        _id: null,
                        totalAmount: { $sum: '$amount' },
                        count: { $sum: 1 },
                        averageAmount: { $avg: '$amount' }
                    }
                }
            ]);

            res.json(stats[0] || { totalAmount: 0, count: 0, averageAmount: 0 });
        } catch (error) {
            console.error('Error fetching donation stats:', error);
            res.status(500).json({ message: 'Error fetching donation statistics' });
        }
    });
};