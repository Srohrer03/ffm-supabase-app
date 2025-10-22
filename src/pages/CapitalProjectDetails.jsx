import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, User, Calendar, DollarSign, MessageSquare, Paperclip, Plus, Send, Upload, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

const CapitalProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [showPhaseForm, setShowPhaseForm] = useState(false);

  // Mock data for demonstration
  const mockProject = {
    id: '1',
    title: 'Main Campus Roof Replacement',
    description: 'Complete roof replacement for Building A including new membrane, insulation, and drainage systems. This project will improve energy efficiency and prevent water damage.',
    budget: 250000,
    startDate: '2024-03-01',
    targetCompletionDate: '2024-06-30',
    status: 'PLANNING',
    site: { name: 'Main Campus' },
    createdBy: { name: 'John Smith', email: 'john@company.com' },
    phases: [
      {
        id: 'phase-1',
        title: 'Phase 1: Planning & Permits',
        description: 'Obtain necessary permits and finalize construction plans',
        startDate: '2024-03-01',
        endDate: '2024-03-31',
        status: 'IN_PROGRESS',
        costEstimate: 15000,
        actualCost: null
      },
      {
        id: 'phase-2',
        title: 'Phase 2: Material Procurement',
        description: 'Order and receive all roofing materials and equipment',
        startDate: '2024-04-01',
        endDate: '2024-04-30',
        status: 'NOT_STARTED',
        costEstimate: 180000,
        actualCost: null
      },
      {
        id: 'phase-3',
        title: 'Phase 3: Installation',
        description: 'Remove old roof and install new roofing system',
        startDate: '2024-05-01',
        endDate: '2024-06-30',
        status: 'NOT_STARTED',
        costEstimate: 55000,
        actualCost: null
      }
    ],
    comments: [
      {
        id: 'comment-1',
        message: 'Project approved by board. Moving forward with Phase 1 planning and permit acquisition.',
        createdAt: '2024-01-20T10:00:00Z',
        user: { name: 'John Smith', email: 'john@company.com' }
      },
      {
        id: 'comment-2',
        message: 'Permits submitted to city planning department. Expecting approval within 2 weeks.',
        createdAt: '2024-01-22T14:30:00Z',
        user: { name: 'Maria Rodriguez', email: 'maria@company.com' }
      }
    ],
    attachments: [
      {
        id: 'attach-1',
        filename: 'roof_replacement_plans.pdf',
        url: '#',
        createdAt: '2024-01-20T11:00:00Z',
        uploadedBy: { name: 'John Smith' }
      },
      {
        id: 'attach-2',
        filename: 'budget_breakdown.xlsx',
        url: '#',
        createdAt: '2024-01-21T09:15:00Z',
        uploadedBy: { name: 'Maria Rodriguez' }
      }
    ]
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProject(mockProject);
      setLoading(false);
    }, 1000);
  }, [id]);

  const getPhaseStatusIcon = (status) => {
    switch (status) {
      case 'NOT_STARTED': return <Clock className="h-4 w-4 text-gray-500" />;
      case 'IN_PROGRESS': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'COMPLETED': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPhaseStatusColor = (status) => {
    switch (status) {
      case 'NOT_STARTED': return 'bg-gray-100 text-gray-800';
      case 'IN_PROGRESS': return 'bg-orange-100 text-orange-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PLANNING': return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS': return 'bg-orange-100 text-orange-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'ON_HOLD': return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmittingComment(true);
    
    try {
      // TODO: API call to add comment
      const comment = {
        id: `comment-${Date.now()}`,
        message: newComment,
        createdAt: new Date().toISOString(),
        user: { name: 'Current User', email: 'user@company.com' }
      };
      
      setProject(prev => ({
        ...prev,
        comments: [comment, ...prev.comments]
      }));
      
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      // TODO: API call to upload file
      const attachment = {
        id: `attach-${Date.now()}`,
        filename: file.name,
        url: '#',
        createdAt: new Date().toISOString(),
        uploadedBy: { name: 'Current User' }
      };
      
      setProject(prev => ({
        ...prev,
        attachments: [attachment, ...prev.attachments]
      }));
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cfs-blue"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">Capital project not found.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title={project.title}
        subtitle={project.description}
      >
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/capital-projects')}
            className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(project.status)}`}>
            {project.status.replace('_', ' ')}
          </span>
          <span className="text-white/80">Budget: ${project.budget.toLocaleString()}</span>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Details */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center text-sm text-gray-600">
                <Building2 className="h-4 w-4 mr-2 text-cfs-blue" />
                <div>
                  <span className="font-medium">Site:</span> {project.site.name}
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <User className="h-4 w-4 mr-2 text-cfs-blue" />
                <div>
                  <span className="font-medium">Created by:</span> {project.createdBy.name}
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2 text-cfs-blue" />
                <div>
                  <span className="font-medium">Start Date:</span> {new Date(project.startDate).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2 text-cfs-blue" />
                <div>
                  <span className="font-medium">Target Completion:</span> {new Date(project.targetCompletionDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          {/* Project Phases */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Project Phases</h2>
              <button
                onClick={() => setShowPhaseForm(true)}
                className="inline-flex items-center px-3 py-1 bg-cfs-blue text-white text-sm font-medium rounded-lg hover:bg-cfs-dark transition-colors duration-200"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Phase
              </button>
            </div>

            <div className="space-y-4">
              {project.phases.map((phase, index) => (
                <div key={phase.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        {getPhaseStatusIcon(phase.status)}
                        <h3 className="text-lg font-medium text-gray-900 ml-2">{phase.title}</h3>
                        <span className={`ml-3 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPhaseStatusColor(phase.status)}`}>
                          {phase.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{phase.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        {phase.startDate && (
                          <div>
                            <span className="font-medium">Start:</span> {new Date(phase.startDate).toLocaleDateString()}
                          </div>
                        )}
                        {phase.endDate && (
                          <div>
                            <span className="font-medium">End:</span> {new Date(phase.endDate).toLocaleDateString()}
                          </div>
                        )}
                        {phase.costEstimate && (
                          <div>
                            <span className="font-medium">Estimate:</span> ${phase.costEstimate.toLocaleString()}
                          </div>
                        )}
                        {phase.actualCost && (
                          <div>
                            <span className="font-medium">Actual:</span> ${phase.actualCost.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Comments</h2>
              <div className="flex items-center text-sm text-gray-500">
                <MessageSquare className="h-4 w-4 mr-1" />
                {project.comments.length} comments
              </div>
            </div>

            {/* Add Comment Form */}
            <form onSubmit={handleAddComment} className="mb-6">
              <div className="flex space-x-3">
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cfs-blue focus:border-transparent resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!newComment.trim() || isSubmittingComment}
                  className="px-4 py-2 bg-cfs-blue text-white rounded-lg hover:bg-cfs-dark transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
              {project.comments.map((comment) => (
                <div key={comment.id} className="border-l-4 border-cfs-blue/20 pl-4 py-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm text-gray-900">{comment.user.name}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{comment.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Project Summary */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Budget:</span>
                <span className="text-sm font-medium text-gray-900">${project.budget.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Estimated Cost:</span>
                <span className="text-sm font-medium text-gray-900">
                  ${project.phases.reduce((sum, p) => sum + (p.costEstimate || 0), 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Phases:</span>
                <span className="text-sm font-medium text-gray-900">{project.phases.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Duration:</span>
                <span className="text-sm font-medium text-gray-900">
                  {Math.ceil((new Date(project.targetCompletionDate) - new Date(project.startDate)) / (1000 * 60 * 60 * 24))} days
                </span>
              </div>
            </div>
          </div>

          {/* Attachments */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Attachments</h3>
              <div className="flex items-center text-sm text-gray-500">
                <Paperclip className="h-4 w-4 mr-1" />
                {project.attachments.length}
              </div>
            </div>

            {/* Upload Button */}
            <div className="mb-4">
              <label className="w-full flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-cfs-blue hover:bg-cfs-blue/5 transition-colors duration-200">
                <Upload className="h-4 w-4 mr-2 text-gray-400" />
                <span className="text-sm text-gray-600">Upload File</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xlsx"
                />
              </label>
            </div>

            {/* Attachments List */}
            <div className="space-y-2">
              {project.attachments.map((attachment) => (
                <div key={attachment.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Paperclip className="h-4 w-4 mr-2 text-gray-400" />
                    <div>
                      <span className="text-sm text-gray-700 truncate">{attachment.filename}</span>
                      <p className="text-xs text-gray-500">by {attachment.uploadedBy.name}</p>
                    </div>
                  </div>
                  <a
                    href={attachment.url}
                    className="text-xs text-cfs-blue hover:text-cfs-dark"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View
                  </a>
                </div>
              ))}
            </div>

            {project.attachments.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">No attachments yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CapitalProjectDetails;