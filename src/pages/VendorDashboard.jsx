import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, AlertTriangle, Building2, User, Calendar, MessageSquare, Paperclip } from 'lucide-react';
import PageHeader from '../components/PageHeader';

const VendorDashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // Mock data for demonstration
  const mockAssignments = [
    {
      id: 'assign-1',
      status: 'PENDING',
      assignedAt: '2024-01-20T10:00:00Z',
      workOrder: {
        id: 'wo-1',
        title: 'HVAC System Maintenance',
        description: 'Quarterly maintenance check for main HVAC system',
        status: 'OPEN',
        priority: 'MEDIUM',
        createdAt: '2024-01-20T09:00:00Z',
        site: { name: 'Main Campus' },
        area: { name: 'Production Floor' },
        requester: { name: 'John Smith', email: 'john@company.com' },
        _count: { comments: 3, attachments: 1 }
      }
    },
    {
      id: 'assign-2',
      status: 'ACCEPTED',
      assignedAt: '2024-01-18T14:30:00Z',
      workOrder: {
        id: 'wo-2',
        title: 'Electrical Panel Inspection',
        description: 'Annual electrical safety inspection required',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        createdAt: '2024-01-18T13:00:00Z',
        site: { name: 'Warehouse Complex' },
        requester: { name: 'Maria Rodriguez', email: 'maria@company.com' },
        _count: { comments: 5, attachments: 2 }
      }
    },
    {
      id: 'assign-3',
      status: 'ACCEPTED',
      assignedAt: '2024-01-15T11:15:00Z',
      workOrder: {
        id: 'wo-3',
        title: 'Fire Safety System Check',
        description: 'Test all fire alarms and sprinkler systems',
        status: 'COMPLETED',
        priority: 'HIGH',
        createdAt: '2024-01-15T10:00:00Z',
        completedAt: '2024-01-19T16:30:00Z',
        site: { name: 'Office Building' },
        requester: { name: 'David Kim', email: 'david@company.com' },
        _count: { comments: 8, attachments: 4 }
      }
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAssignments(mockAssignments);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredAssignments = assignments.filter(assignment => {
    if (filter === 'all') return true;
    if (filter === 'pending') return assignment.status === 'PENDING';
    if (filter === 'active') return assignment.status === 'ACCEPTED' && assignment.workOrder.status !== 'COMPLETED';
    if (filter === 'completed') return assignment.workOrder.status === 'COMPLETED';
    return true;
  });

  const handleAccept = async (assignmentId) => {
    // TODO: API call to accept assignment
    setAssignments(assignments.map(a => 
      a.id === assignmentId ? { ...a, status: 'ACCEPTED' } : a
    ));
  };

  const handleDecline = async (assignmentId) => {
    // TODO: API call to decline assignment
    setAssignments(assignments.map(a => 
      a.id === assignmentId ? { ...a, status: 'DECLINED' } : a
    ));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'ACCEPTED': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'DECLINED': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'ACCEPTED': return 'bg-green-100 text-green-800 border-green-200';
      case 'DECLINED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const getWorkOrderStatusColor = (status) => {
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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vendor Dashboard"
        subtitle="Manage your assigned work orders and tasks"
      />

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="border-b border-gray-100">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { key: 'all', label: 'All Assignments', count: assignments.length },
              { key: 'pending', label: 'Pending', count: assignments.filter(a => a.status === 'PENDING').length },
              { key: 'active', label: 'Active', count: assignments.filter(a => a.status === 'ACCEPTED' && a.workOrder.status !== 'COMPLETED').length },
              { key: 'completed', label: 'Completed', count: assignments.filter(a => a.workOrder.status === 'COMPLETED').length }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 leading-normal ${
                  filter === tab.key
                    ? 'border-cfs-blue text-cfs-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                  filter === tab.key ? 'bg-cfs-blue/10 text-cfs-blue' : 'bg-gray-100 text-gray-500'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {filteredAssignments.map((assignment) => (
              <div
                key={assignment.id}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 mr-3">
                        {assignment.workOrder.title}
                      </h3>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(assignment.workOrder.priority)}`}>
                        {assignment.workOrder.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{assignment.workOrder.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Building2 className="h-4 w-4 mr-2 text-cfs-blue" />
                        {assignment.workOrder.site.name}
                        {assignment.workOrder.area && ` - ${assignment.workOrder.area.name}`}
                      </div>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-cfs-blue" />
                        {assignment.workOrder.requester.name}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-cfs-blue" />
                        Assigned: {new Date(assignment.assignedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(assignment.status)}
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(assignment.status)}`}>
                        {assignment.status}
                      </span>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getWorkOrderStatusColor(assignment.workOrder.status)}`}>
                      WO: {assignment.workOrder.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      {assignment.workOrder._count.comments} comments
                    </div>
                    <div className="flex items-center">
                      <Paperclip className="h-4 w-4 mr-1" />
                      {assignment.workOrder._count.attachments} attachments
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {assignment.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleDecline(assignment.id)}
                          className="px-3 py-1 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors duration-200"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => handleAccept(assignment.id)}
                          className="px-3 py-1 text-sm font-medium text-white bg-cfs-blue rounded-lg hover:bg-cfs-dark transition-colors duration-200"
                        >
                          Accept
                        </button>
                      </>
                    )}
                    
                    {assignment.status === 'ACCEPTED' && (
                      <a
                        href={`/vendor/work-orders/${assignment.workOrder.id}`}
                        className="px-3 py-1 text-sm font-medium text-white bg-cfs-blue rounded-lg hover:bg-cfs-dark transition-colors duration-200"
                      >
                        View Details
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredAssignments.length === 0 && (
            <div className="text-center py-12">
              <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <div className="text-gray-500">No assignments found for the selected filter.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;