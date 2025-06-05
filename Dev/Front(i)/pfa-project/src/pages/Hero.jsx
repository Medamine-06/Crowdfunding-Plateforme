import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectService } from '../services/api';


const Hero = () => {
  const designImage = '/assets/designImage.png'
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        console.log('Attempting to fetch projects...');
        const data = await projectService.getAllProjects();
        console.log('Projects data received:', data);
        if (Array.isArray(data)) {
          const approvedProjects = data.filter(project => project.status === 'approved');
          setProjects(approvedProjects );
        } else {
          console.error('Received non-array data:', data);
          setError('Invalid data format received from server');
        }
        setLoading(false);
      } catch (err) {
        console.error('Detailed error:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
          headers: err.response?.headers
        });
        setError(err.response?.data?.message || 'Failed to fetch projects. Please check if the backend server is running.');
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const calculateProgress = (currentAmount, goalAmount) => {
    return Math.min(Math.round((currentAmount / goalAmount) * 100), 100);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-gray-100">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Support Tunisian Dreams & Innovations
                </h1>
                <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  TuniFund connects Tunisian creators, entrepreneurs, and dreamers with supporters worldwide. Fund
                  projects that matter and help build a brighter future for Tunisia.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link to="/discover">
                    <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200">
                      Discover Projects
                    </button>
                  </Link>
                  <Link to="/campaignForm">
                    <button className="px-4 py-2 bg-white border border-gray-300 text-black rounded-md hover:text-red-700 transition-colors duration-200">
                      Start Your Project
                    </button>
                  </Link>
                </div>
              </div>
              <div className="mx-auto lg:ml-auto">
                <img
                  src={designImage}
                  alt="Tunisian entrepreneurs"
                  className="rounded-lg object-cover w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Featured Projects Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter mb-8">Featured Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Link 
                  key={project._id} 
                  to={`/projects/${project._id}`}
                  className="group"
                >
                  <div className="overflow-hidden rounded-lg border bg-white transition-all hover:shadow-lg">
                    <div className="relative h-48">
                      <img
                        src={project.image ? `http://localhost:3000/${project.image}` : `placeholder.png`}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                        {calculateProgress(project.currentAmount, project.goalAmount)}% Funded
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg group-hover:text-red-600 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {project.description.substring(0, 100)}...
                      </p>
                      <div className="mt-4 flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-900">
                          {project.currentAmount.toLocaleString()} TND
                        </span>
                        <span className="text-sm text-gray-500">
                          of {project.goalAmount.toLocaleString()} TND
                        </span>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-600 h-2 rounded-full"
                          style={{ width: `${calculateProgress(project.currentAmount, project.goalAmount)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Hero;