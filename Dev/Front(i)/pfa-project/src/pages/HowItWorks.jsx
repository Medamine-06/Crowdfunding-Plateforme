import React from 'react';

const HowItWorks = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-center mb-12">How It Works</h1>
        
        {/* For Project Creators */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">For Project Creators</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform">
              <div className="text-4xl mb-4 text-center">1</div>
              <img 
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" 
                alt="Create Project" 
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Create Your Project</h3>
              <p className="text-gray-600">
                Start by creating your project page. Add a compelling title, description, and images that tell your story.
                Set your funding goal and deadline.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform">
              <div className="text-4xl mb-4 text-center">2</div>
              <img 
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" 
                alt="Review Process" 
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Review Process</h3>
              <p className="text-gray-600">
                Our team reviews your project to ensure it meets our guidelines. This typically takes 1-2 business days.
                We verify the feasibility and authenticity of your project.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform">
              <div className="text-4xl mb-4 text-center">3</div>
              <img 
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" 
                alt="Launch & Promote" 
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Launch & Promote</h3>
              <p className="text-gray-600">
                Once approved, your project goes live! Share it with your network and start receiving donations.
                Track your progress and engage with your backers.
              </p>
            </div>
          </div>
        </div>

        {/* For Donors */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">For Donors</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform">
              <div className="text-4xl mb-4 text-center">1</div>
              <img 
                src="https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" 
                alt="Discover Projects" 
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Discover Projects</h3>
              <p className="text-gray-600">
                Browse through our curated list of projects. Filter by category, funding status, or location.
                Find projects that align with your interests and values.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform">
              <div className="text-4xl mb-4 text-center">2</div>
              <img 
                src="https://images.unsplash.com/photo-1556742044-3c52d6e88c62?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" 
                alt="Make a Donation" 
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Make a Donation</h3>
              <p className="text-gray-600">
                Choose your donation amount and payment method. We accept various payment options including
                bank cards and e-DINAR for secure transactions.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform">
              <div className="text-4xl mb-4 text-center">3</div>
              <img 
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" 
                alt="Track Progress" 
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
              <p className="text-gray-600">
                Follow the progress of projects you've supported. Receive updates on funding milestones
                and project developments.
              </p>
            </div>
          </div>
        </div>

        {/* Platform Features */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Platform Features</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Security & Trust</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Secure payment processing through Konnect</li>
                <li>Project verification process</li>
                <li>Transparent funding tracking</li>
                <li>Secure user authentication</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Support & Community</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>24/7 customer support</li>
                <li>Active community engagement</li>
                <li>Regular project updates</li>
                <li>Success stories and testimonials</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-gray-600 mb-6">
            Join our community of creators and donors today. Make a difference in the world of crowdfunding.
          </p>
          <div className="space-x-4">
            <a 
              href="/discover" 
              className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Browse Projects
            </a>

          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks; 