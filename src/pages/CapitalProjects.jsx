import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Building2, Calendar, DollarSign, User, Eye, Edit, Trash2, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import PageHeader from '../components/PageHeader';

const CapitalProjects = () => {
  const [projects, setProjects] = useState([]);
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('view');

  // Mock data for demonstration
  const mockProjects = [
    {
      id: '1',
      title: 'Main Campus Roof Replacement',
      description: 'Complete roof replacement for Building A including new membrane, insulation, and drainage systems',
      budget: 250000,
      startDate: '2024-03-01',
      targetCompletionDate: '2024-06-30',
      status: 'PLANNING',
      site: { name: 'Main Campus' },
      createdBy: { name: 'John Smith' },
      _count: { phases: 3, comments: 5, attachments: 2 }
    },
    {
      id: '2',
      title: 'Warehouse HVAC Upgrade',
      description: 'Install new energy-efficient HVAC system in Warehouse Complex',
      budget: 180000,
      startDate: '2024-02-15',
      targetCompletionDate: '2024-05-15',
      status: 'IN_PROGRESS',
      site: { name: 'Warehouse Complex' },
      createdBy: { name: 'Maria Rodriguez' },
      _count: { phases: 4, comments: 12, attachments: 8 }
    },
    {
      id: '3',
      title: 'Security System Overhaul',
      description: 'Complete security system upgrade with new cameras and access control',
      budget: 95000,
      startDate: '2024-01-01',
      targetCompletionDate: '2024-03-31',
      status: 'COMPLETED',
      site: { name: 'Processing Facility' },
      createdBy: { name: 'David Kim' },
      _count: { phases: 2, comments: 8, attachments: 15 }
    }
  ];

  const mockSites = [
    { id: 'site-1', name: 'Main Campus' },
    { id: 'site-2', name: 'Warehouse Complex' },
    { id: 'site-3', name: 'Processing Facility' }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProjects(mockProjects);
      setSites(mockSites);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.site?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PLANNING': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'IN_PROGRESS': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'COMPLETED': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'ON_HOLD': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'CANCELLED': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PLANNING': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'IN_PROGRESS': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-200';
      case 'ON_HOLD': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleView = (project) => {
    setSelectedProject(project);
    setModalType('view');
    setShowModal(true);
  };

  const handleEdit = (project) => {
    setSelectedProject(project);
    setModalType('edit');
    setShowModal(true);
  };

  const handleDelete = (project) => {
    if (window.confirm(`Are you sure you want to delete "${project.title}"?`)) {
      setProjects(projects.filter(p => p.id !== project.id));
    }
  };

  const handleAdd = () => {
    setSelectedProject(null);
    setModalType('add');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProject(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cfs-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Capital Projects"
        subtitle="Manage large-scale facility improvement projects"
      >
        <button
          onClick={handleAdd}
          className="inline-flex items-center px-6 py-3 bg-white text-cfs-blue text-sm font-medium rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </button>
      </PageHeader>
      
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-cfs-light focus:border-transparent text-white placeholder-white/60 backdrop-blur-sm"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-cfs-light focus:border-transparent text-white backdrop-blur-sm"
          >
            <option value="all" style={{ backgroundColor: '#0057B8', color: 'white' }}>All Status</option>
            <option value="PLANNING" style={{ backgroundColor: '#0057B8', color: 'white' }}>Planning</option>
            <option value="IN_PROGRESS" style={{ backgroundColor: '#0057B8', color: 'white' }}>In Progress</option>
            <option value="COMPLETED" style={{ backgroundColor: '#0057B8', color: 'white' }}>Completed</option>
            <option value="ON_HOLD" style={{ backgroundColor: '#0057B8', color: 'white' }}>On Hold</option>
            <option value="CANCELLED" style={{ backgroundColor: '#0057B8', color: 'white' }}>Cancelled</option>
          </select>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Projects</p>
              <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">
                {projects.filter(p => p.status === 'IN_PROGRESS').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {projects.filter(p => p.status === 'COMPLETED').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900">
                ${projects.reduce((sum, p) => sum + p.budget, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.title}</h3>
                <div className="flex items-center mb-2">
                  {getStatusIcon(project.status)}
                  <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(project.status)}`}>
                    {project.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Building2 className="h-4 w-4 mr-2 text-cfs-blue" />
                {project.site?.name}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <DollarSign className="h-4 w-4 mr-2 text-cfs-blue" />
                Budget: ${project.budget.toLocaleString()}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2 text-cfs-blue" />
                {new Date(project.startDate).toLocaleDateString()} - {new Date(project.targetCompletionDate).toLocaleDateString()}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <User className="h-4 w-4 mr-2 text-cfs-blue" />
                Created by: {project.createdBy?.name}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center text-xs text-gray-500 space-x-3">
                <span>{project._count?.phases || 0} phases</span>
                <span>{project._count?.comments || 0} comments</span>
                <span>{project._count?.attachments || 0} files</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleView(project)}
                  className="text-cfs-blue hover:text-cfs-dark p-1 rounded hover:bg-cfs-blue/10 transition-colors duration-150"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleEdit(project)}
                  className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-100 transition-colors duration-150"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(project)}
                  className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors duration-150"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <div className="text-gray-500">No capital projects found matching your criteria.</div>
        </div>
      )}
    </div>
  );
};

export default CapitalProjects;