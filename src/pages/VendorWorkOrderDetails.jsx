import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, User, Calendar, Clock, MessageSquare, Paperclip, Plus, Send, Upload } from 'lucide-react';

const VendorWorkOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workOrder, setWorkOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Mock data for demonstration
  const mockWorkOrder = {
    id: 'wo-2',
    title: 'Electrical Panel Inspection',
    description: 'Annual electrical safety inspection required for compliance. Check all connections, test safety switches, and verify proper grounding.',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    createdAt: '2024-01-18T13:00:00Z',
    site: { name: 'Warehouse Complex' },
    area: { name: 'Electrical Room' },
    asset: { name: 'Main Panel #1' },
    requester: { name: 'Maria Rodriguez', email: 'maria@company.com' },
    assignedTo: { name: 'John Smith', email: 'john@company.com' },
    comments: [
      {
        id: 'comment-1',
        message: 'Started inspection. Found minor corrosion on panel 3.',
        createdAt: '2024-01-19T09:30:00Z',
        user: { name: 'Vendor Tech', email: 'tech@vendor.com' }
      },
      {
        id: 'comment-2',
        message: 'Please prioritize the main distribution panel first.',
        createdAt: '2024-01-18T15:00:00Z',
        user: { name: 'Maria Rodriguez', email: 'maria@company.com' }
      },
      {
        id: 'comment-3',
        message: 'Assignment accepted. Will begin inspection tomorrow morning.',
        createdAt: '2024-01-18T14:45:00Z',
        user: { name: 'Vendor Tech', email: 'tech@vendor.com' }
      }
    ],
    attachments: [
      {
        id: 'attach-1',
        filename: 'panel_inspection_checklist.pdf',
        url: '#',
        createdAt: '2024-01-19T10:00:00Z'
      },
      {
        id: 'attach-2',
        filename: 'before_photo_panel3.jpg',
        url: '#',
        createdAt: '2024-01-19T09:45:00Z'
      }
    ]
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setWorkOrder(mockWorkOrder);
      setLoading(false);
    }, 1000);
  }, [id]);

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
        user: { name: 'Vendor Tech', email: 'tech@vendor.com' }
      };
      
      setWorkOrder(prev => ({
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

  const handleStatusUpdate = async (newStatus) => {
    setIsUpdatingStatus(true);
    
    try {
      // TODO: API call to update status
      setWorkOrder(prev => ({
        ...prev,
        status: newStatus,
        completedAt: newStatus === 'COMPLETED' ? new Date().toISOString() : undefined
      }));
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsUpdatingStatus(false);
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
        createdAt: new Date().toISOString()
      };
      
      setWorkOrder(prev => ({
        ...prev,
        attachments: [attachment, ...prev.attachments]
      }));
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-green-100 text-green-800';
      case 'EMERGENCY': return 'bg-red-200 text-red-900';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'OPEN': return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS': return 'bg-orange-100 text-orange-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cfs-blue"></div>
      </div>
    );
  }

  if (!workOrder) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">Work order not found.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title={`Work Order #${workOrder.id}`}
        subtitle={workOrder.title}
      >
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/vendor')}
            className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getPriorityColor(workOrder.priority)}`}>
            {workOrder.priority} Priority
          </span>
          <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(workOrder.status)}`}>
            {workOrder.status}
          </span>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Work Order Details */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Work Order Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <p className="text-sm text-gray-900">{workOrder.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Building2 className="h-4 w-4 mr-2 text-cfs-blue" />
                  <div>
                    <span className="font-medium">Location:</span> {workOrder.site.name}
                    {workOrder.area && ` - ${workOrder.area.name}`}
                    {workOrder.asset && ` - ${workOrder.asset.name}`}
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <User className="h-4 w-4 mr-2 text-cfs-blue" />
                  <div>
                    <span className="font-medium">Requester:</span> {workOrder.requester.name}
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2 text-cfs-blue" />
                  <div>
                    <span className="font-medium">Created:</span> {new Date(workOrder.createdAt).toLocaleDateString()}
                  </div>
                </div>
                {workOrder.completedAt && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2 text-cfs-blue" />
                    <div>
                      <span className="font-medium">Completed:</span> {new Date(workOrder.completedAt).toLocaleDateString()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Comments</h2>
              <div className="flex items-center text-sm text-gray-500">
                <MessageSquare className="h-4 w-4 mr-1" />
                {workOrder.comments.length} comments
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
              {workOrder.comments.map((comment) => (
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
          {/* Status Actions */}
          {workOrder.status !== 'COMPLETED' && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Status</h3>
              <div className="space-y-3">
                {workOrder.status === 'OPEN' && (
                  <button
                    onClick={() => handleStatusUpdate('IN_PROGRESS')}
                    disabled={isUpdatingStatus}
                    className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200 disabled:opacity-50"
                  >
                    Start Work
                  </button>
                )}
                {workOrder.status === 'IN_PROGRESS' && (
                  <button
                    onClick={() => handleStatusUpdate('COMPLETED')}
                    disabled={isUpdatingStatus}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
                  >
                    Mark Complete
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Attachments */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Attachments</h3>
              <div className="flex items-center text-sm text-gray-500">
                <Paperclip className="h-4 w-4 mr-1" />
                {workOrder.attachments.length}
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
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
              </label>
            </div>

            {/* Attachments List */}
            <div className="space-y-2">
              {workOrder.attachments.map((attachment) => (
                <div key={attachment.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Paperclip className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-sm text-gray-700 truncate">{attachment.filename}</span>
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

            {workOrder.attachments.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">No attachments yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorWorkOrderDetails;