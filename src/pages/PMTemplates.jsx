import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Calendar, Clock, AlertTriangle } from 'lucide-react';
import PMTemplateCard from '../components/PMTemplateCard';
import PMTemplateForm from '../components/PMTemplateForm';
import PageHeader from '../components/PageHeader';

const PMTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [sites, setSites] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [frequencyFilter, setFrequencyFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data for demonstration
  const mockTemplates = [
    {
      id: '1',
      title: 'HVAC Filter Replacement',
      description: 'Replace air filters in all HVAC units and inspect system operation',
      frequency: 'MONTHLY',
      priority: 'MEDIUM',
      siteId: 'site-1',
      site: { name: 'Main Campus' },
      area: { name: 'Production Floor' },
      assignedTo: { name: 'John Smith' },
      _count: { occurrences: 12 }
    },
    {
      id: '2',
      title: 'Fire Safety System Check',
      description: 'Test all fire alarms, sprinklers, and emergency exits',
      frequency: 'QUARTERLY',
      priority: 'HIGH',
      siteId: 'site-1',
      site: { name: 'Main Campus' },
      assignedTo: { name: 'Maria Rodriguez' },
      _count: { occurrences: 4 }
    },
    {
      id: '3',
      title: 'Equipment Lubrication',
      description: 'Lubricate all moving parts of production equipment',
      frequency: 'WEEKLY',
      priority: 'MEDIUM',
      siteId: 'site-2',
      site: { name: 'Warehouse Complex' },
      area: { name: 'Equipment Room' },
      assignedTo: { name: 'David Kim' },
      _count: { occurrences: 52 }
    }
  ];

  const mockSites = [
    {
      id: 'site-1',
      name: 'Main Campus',
      buildings: [
        {
          id: 'building-1',
          name: 'Building A',
          areas: [
            {
              id: 'area-1',
              name: 'Production Floor',
              assets: [
                { id: 'asset-1', name: 'HVAC Unit #1' },
                { id: 'asset-2', name: 'Conveyor Belt #1' }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'site-2',
      name: 'Warehouse Complex',
      buildings: [
        {
          id: 'building-2',
          name: 'Warehouse A',
          areas: [
            {
              id: 'area-2',
              name: 'Equipment Room',
              assets: [
                { id: 'asset-3', name: 'Forklift #1' },
                { id: 'asset-4', name: 'Loading Dock #1' }
              ]
            }
          ]
        }
      ]
    }
  ];

  const mockUsers = [
    { id: 'user-1', name: 'John Smith' },
    { id: 'user-2', name: 'Maria Rodriguez' },
    { id: 'user-3', name: 'David Kim' },
    { id: 'user-4', name: 'Sarah Johnson' }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setTemplates(mockTemplates);
      setSites(mockSites);
      setUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.site?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFrequency = frequencyFilter === 'all' || template.frequency === frequencyFilter;
    
    return matchesSearch && matchesFrequency;
  });

  const handleView = (template) => {
    // Navigate to template details or show modal
    console.log('View template:', template);
  };

  const handleEdit = (template) => {
    setSelectedTemplate(template);
    setShowForm(true);
  };

  const handleDelete = (template) => {
    if (window.confirm(`Are you sure you want to delete "${template.title}"?`)) {
      setTemplates(templates.filter(t => t.id !== template.id));
    }
  };

  const handleAdd = () => {
    setSelectedTemplate(null);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (selectedTemplate) {
        // Update existing template
        setTemplates(templates.map(t => 
          t.id === selectedTemplate.id 
            ? { ...t, ...formData, site: sites.find(s => s.id === formData.siteId) }
            : t
        ));
      } else {
        // Create new template
        const newTemplate = {
          id: Date.now().toString(),
          ...formData,
          site: sites.find(s => s.id === formData.siteId),
          assignedTo: users.find(u => u.id === formData.assignedToId),
          _count: { occurrences: 0 }
        };
        setTemplates([...templates, newTemplate]);
      }
      
      setShowForm(false);
      setSelectedTemplate(null);
    } catch (error) {
      console.error('Error saving template:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedTemplate(null);
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
        title="PM Templates"
        subtitle="Create and manage preventive maintenance templates"
      >
        <button
          onClick={handleAdd}
          className="inline-flex items-center px-6 py-3 bg-white text-cfs-blue text-sm font-medium rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Template
        </button>
      </PageHeader>
      
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-cfs-light focus:border-transparent text-white placeholder-white/60 backdrop-blur-sm"
            />
          </div>
          <select
            value={frequencyFilter}
            onChange={(e) => setFrequencyFilter(e.target.value)}
            className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-cfs-light focus:border-transparent text-white backdrop-blur-sm"
            style={{
              backgroundImage: 'none'
            }}
          >
            <option value="all" style={{ backgroundColor: '#0057B8', color: 'white' }}>All Frequencies</option>
            <option value="DAILY" style={{ backgroundColor: '#0057B8', color: 'white' }}>Daily</option>
            <option value="WEEKLY" style={{ backgroundColor: '#0057B8', color: 'white' }}>Weekly</option>
            <option value="MONTHLY" style={{ backgroundColor: '#0057B8', color: 'white' }}>Monthly</option>
            <option value="QUARTERLY" style={{ backgroundColor: '#0057B8', color: 'white' }}>Quarterly</option>
            <option value="SEMI_ANNUAL" style={{ backgroundColor: '#0057B8', color: 'white' }}>Semi-Annual</option>
            <option value="ANNUAL" style={{ backgroundColor: '#0057B8', color: 'white' }}>Annual</option>
          </select>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Templates</p>
              <p className="text-2xl font-bold text-gray-900">{templates.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Templates</p>
              <p className="text-2xl font-bold text-gray-900">{templates.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-gray-900">
                {templates.filter(t => t.priority === 'HIGH').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <Filter className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Occurrences</p>
              <p className="text-2xl font-bold text-gray-900">
                {templates.reduce((sum, t) => sum + (t._count?.occurrences || 0), 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <PMTemplateCard
            key={template.id}
            template={template}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <div className="text-gray-500">No PM templates found matching your criteria.</div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <PMTemplateForm
          template={selectedTemplate}
          sites={sites}
          users={users}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          isLoading={isSubmitting}
        />
      )}
    </div>
  );
};

export default PMTemplates;