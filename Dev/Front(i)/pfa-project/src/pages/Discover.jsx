import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectService } from '../services/api';

const categories = [
  'All Projects',
  'Technology',
  'Agriculture',
  'Education',
  'Arts & Culture',
  'Healthcare',
  'Environment',
  'Community',
];

const fundingStatus = [
  'All',
  'Less than 25%',
  '25% - 50%',
  '50% - 75%',
  '75% - 100%',
  'Fully Funded',
];

const placeholderImage = '/assets/placeholder.png';

function daysLeft(deadline) {
  if (!deadline) return '--';
  const end = new Date(deadline);
  const now = new Date();
  const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

const Discover = () => {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('Newest');
  const [selectedCategory, setSelectedCategory] = useState('All Projects');
  const [selectedFunding, setSelectedFunding] = useState('All');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectService.getAllProjects();
        //filter for approved projects
        const approvedProjects = data.filter(project => project.status === 'approved');
        setProjects(approvedProjects);
        
      } catch (err) {
        setProjects([]);
      }
    };
    fetchProjects();
  }, []);

  // Filter and search logic
  const filteredProjects = projects.filter(project => {
    // Category filter
    if (selectedCategory !== 'All Projects' && project.category.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
      
    }
    // Funding status filter
    const percent = (project.currentAmount / project.goalAmount) * 100;
    if (selectedFunding === 'Less than 25%' && percent >= 25) return false;
    if (selectedFunding === '25% - 50%' && (percent < 25 || percent >= 50)) return false;
    if (selectedFunding === '50% - 75%' && (percent < 50 || percent >= 75)) return false;
    if (selectedFunding === '75% - 100%' && (percent < 75 || percent >= 100)) return false;
    if (selectedFunding === 'Fully Funded' && percent < 100) return false;
    // Search filter
    if (search && !project.title.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;

  });
  

  // Sort logic (only Newest for now)
  const sortedProjects = [...filteredProjects];
  if (sort === 'Newest') {
    sortedProjects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-1">Discover Projects</h1>
        <p className="text-gray-500 mb-8">Find and support innovative Tunisian projects</p>
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 hidden md:block">
            <div className="bg-white rounded-xl shadow p-6 mb-6">
              <h2 className="font-semibold mb-4">Categories</h2>
              <ul className="space-y-2">
                {categories.map(cat => (
                  <li key={cat}>
                    <button
                      className={`text-left w-full px-2 py-1 rounded hover:bg-gray-100 ${selectedCategory === cat ? 'font-bold text-red-600' : 'text-gray-700'}`}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="font-semibold mb-4">Funding Status</h2>
              <ul className="space-y-2">
                {fundingStatus.map(status => (
                  <li key={status}>
                    <button
                      className={`text-left w-full px-2 py-1 rounded hover:bg-gray-100 ${selectedFunding === status ? 'font-bold text-red-600' : 'text-gray-700'}`}
                      onClick={() => setSelectedFunding(status)}
                    >
                      {status}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
          {/* Main Content */}
          <main className="flex-1">
            {/* Top bar */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
              <input
                type="text"
                placeholder="Search projects..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-600 focus:border-red-600"
              />
   
            </div>
            {/* Projects Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProjects.map(project => {
              const percent = Math.min(100, Math.round((project.currentAmount / project.goalAmount) * 100));
                return (
                  <Link key={project._id} to={`/projects/${project._id}`} className="group">
                    <div className="bg-white rounded-xl shadow p-4 flex flex-col h-full transition-all hover:shadow-lg">
                      <div className="relative h-40 mb-4 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                        <img
                          src={project.image ? `http://localhost:3000/${project.image}` : placeholderImage}
                          alt={project.title}
                          className="object-cover w-full h-full"
                          onError={e => {
                            if (e.target.src !== placeholderImage) {
                              e.target.src = placeholderImage;
                            }
                          }}
                        />
                        <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                          {percent}% Funded
                        </span>
                      </div>
                      <h3 className="font-bold text-lg mb-1 group-hover:text-red-600 transition-colors duration-200">
                        {project.title}
                      </h3>
                      <p className="text-gray-500 text-sm mb-2">{project.subtitle || project.description?.substring(0, 60) + '...'}</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div
                          className="bg-red-600 h-2 rounded-full"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between items-center text-sm text-gray-700 mt-auto">
                        <span>{project.currentAmount?.toLocaleString()} DT raised</span>
                        <span>{daysLeft(project.deadline)} days left</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
              {sortedProjects.length === 0 && (
                <div className="col-span-full text-center text-gray-500 py-12">No projects found.</div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Discover; 