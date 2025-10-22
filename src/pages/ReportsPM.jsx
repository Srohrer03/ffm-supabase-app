import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, Clock, AlertTriangle, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const ReportsPM = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSite, setSelectedSite] = useState('');
  const [dateRange, setDateRange] = useState('6months');

  // Mock data for demonstration
  const mockData = {
    summary: {
      totalTemplates: 15,
      totalOccurrences: 78,
      completed: 73,
      complianceRate: 94,
      upcomingDue: 8,
      overdue: 2
    },
    complianceTrend: [
      { month: 'Jul', scheduled: 12, completed: 11, onTime: 10 },
      { month: 'Aug', scheduled: 15, completed: 14, onTime: 13 },
      { month: 'Sep', scheduled: 10, completed: 9, onTime: 8 },
      { month: 'Oct', scheduled: 18, completed: 17, onTime: 16 },
      { month: 'Nov', scheduled: 14, completed: 13, onTime: 12 },
      { month: 'Dec', scheduled: 9, completed: 9, onTime: 8 }
    ],
    byFrequency: [
      { frequency: 'WEEKLY', total: 8, completed: 7, rate: 88 },
      { frequency: 'MONTHLY', total: 25, completed: 24, rate: 96 },
      { frequency: 'QUARTERLY', total: 20, completed: 19, rate: 95 },
      { frequency: 'SEMI_ANNUAL', total: 15, completed: 14, rate: 93 },
      { frequency: 'ANNUAL', total: 10, completed: 9, rate: 90 }
    ],
    byCategory: [
      { category: 'HVAC', count: 28, compliance: 96 },
      { category: 'Safety', count: 18, compliance: 100 },
      { category: 'Equipment', count: 15, compliance: 87 },
      { category: 'Electrical', count: 12, compliance: 92 },
      { category: 'Grounds', count: 5, compliance: 100 }
    ],
    upcomingTasks: [
      { id: 'PM001', title: 'HVAC Filter Replacement', site: 'Main Campus', dueDate: '2024-01-25', priority: 'MEDIUM' },
      { id: 'PM002', title: 'Fire Safety System Check', site: 'Warehouse Complex', dueDate: '2024-01-26', priority: 'HIGH' },
      { id: 'PM003', title: 'Equipment Lubrication', site: 'Processing Facility', dueDate: '2024-01-28', priority: 'MEDIUM' },
      { id: 'PM004', title: 'Security Camera Maintenance', site: 'Storage Unit Beta', dueDate: '2024-01-30', priority: 'LOW' }
    ],
    templatePerformance: [
      { template: 'HVAC Filter Replacement', occurrences: 12, completed: 12, avgDays: 0.5 },
      { template: 'Fire Safety System Check', occurrences: 4, completed: 4, avgDays: 1.2 },
      { template: 'Equipment Lubrication', occurrences: 52, completed: 48, avgDays: 0.8 },
      { template: 'Security Camera Maintenance', occurrences: 2, completed: 1, avgDays: 2.5 },
      { template: 'Landscape Irrigation Check', occurrences: 8, completed: 8, avgDays: 0.3 }
    ]
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 1000);
  }, [selectedSite, dateRange]);

  const COLORS = {
    primary: '#0057B8',
    success: '#16A34A',
    warning: '#FACC15',
    danger: '#DC2626',
    purple: '#8B5CF6',
    orange: '#F97316'
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
      {/* Header */}
      <PageHeader
        title="PM Compliance Report"
        subtitle="Track preventive maintenance performance and compliance"
      >
        <div className="flex gap-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-cfs-light focus:border-transparent text-white backdrop-blur-sm"
          >
            <option value="3months" style={{ backgroundColor: '#0057B8', color: 'white' }}>Last 3 Months</option>
            <option value="6months" style={{ backgroundColor: '#0057B8', color: 'white' }}>Last 6 Months</option>
            <option value="1year" style={{ backgroundColor: '#0057B8', color: 'white' }}>Last Year</option>
          </select>
          <select
            value={selectedSite}
            onChange={(e) => setSelectedSite(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-cfs-light focus:border-transparent text-white backdrop-blur-sm"
          >
            <option value="" style={{ backgroundColor: '#0057B8', color: 'white' }}>All Sites</option>
            <option value="site-1" style={{ backgroundColor: '#0057B8', color: 'white' }}>Main Campus</option>
            <option value="site-2" style={{ backgroundColor: '#0057B8', color: 'white' }}>Warehouse Complex</option>
          </select>
        </div>
      </PageHeader>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Templates</p>
              <p className="text-2xl font-bold text-gray-900">{data.summary.totalTemplates}</p>
              <p className="text-xs text-gray-500">{data.summary.totalOccurrences} occurrences</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Compliance Rate</p>
              <p className="text-2xl font-bold text-gray-900">{data.summary.complianceRate}%</p>
              <p className="text-xs text-gray-500">{data.summary.completed} completed</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Upcoming Due</p>
              <p className="text-2xl font-bold text-gray-900">{data.summary.upcomingDue}</p>
              <p className="text-xs text-gray-500">Next 30 days</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-gray-900">{data.summary.overdue}</p>
              <p className="text-xs text-gray-500">Needs attention</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compliance Trend */}
        <div className="bg-white rounded-xl shadow-lg p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">PM Compliance Trend</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data.complianceTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="scheduled" stroke={COLORS.primary} strokeWidth={2} name="Scheduled" />
              <Line type="monotone" dataKey="completed" stroke={COLORS.success} strokeWidth={2} name="Completed" />
              <Line type="monotone" dataKey="onTime" stroke={COLORS.purple} strokeWidth={2} name="On Time" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* By Frequency */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance by Frequency</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.byFrequency}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="frequency" />
              <YAxis />
              <Tooltip formatter={(value, name) => [name === 'rate' ? `${value}%` : value, name === 'rate' ? 'Compliance Rate' : 'Count']} />
              <Bar dataKey="rate" fill={COLORS.success} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* By Category */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">PM Tasks by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.byCategory}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="count"
                nameKey="category"
                label={({ category, count }) => `${category}: ${count}`}
              >
                {data.byCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={Object.values(COLORS)[index % Object.values(COLORS).length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Upcoming Tasks */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming PM Tasks</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4">Task ID</th>
                <th className="text-left py-3 px-4">Title</th>
                <th className="text-left py-3 px-4">Site</th>
                <th className="text-center py-3 px-4">Due Date</th>
                <th className="text-center py-3 px-4">Priority</th>
                <th className="text-center py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.upcomingTasks.map((task, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{task.id}</td>
                  <td className="py-3 px-4">{task.title}</td>
                  <td className="py-3 px-4">{task.site}</td>
                  <td className="text-center py-3 px-4">{task.dueDate}</td>
                  <td className="text-center py-3 px-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      task.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                      task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="text-center py-3 px-4">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      Scheduled
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Template Performance */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Template Performance Analysis</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4">Template</th>
                <th className="text-center py-3 px-4">Total Occurrences</th>
                <th className="text-center py-3 px-4">Completed</th>
                <th className="text-center py-3 px-4">Completion Rate</th>
                <th className="text-center py-3 px-4">Avg Completion Time</th>
                <th className="text-center py-3 px-4">Performance</th>
              </tr>
            </thead>
            <tbody>
              {data.templatePerformance.map((template, index) => {
                const completionRate = Math.round((template.completed / template.occurrences) * 100);
                return (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{template.template}</td>
                    <td className="text-center py-3 px-4">{template.occurrences}</td>
                    <td className="text-center py-3 px-4">{template.completed}</td>
                    <td className="text-center py-3 px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        completionRate >= 95 ? 'bg-green-100 text-green-800' :
                        completionRate >= 85 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {completionRate}%
                      </span>
                    </td>
                    <td className="text-center py-3 px-4">{template.avgDays} days</td>
                    <td className="text-center py-3 px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        completionRate >= 95 ? 'bg-green-100 text-green-800' :
                        completionRate >= 85 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {completionRate >= 95 ? 'Excellent' :
                         completionRate >= 85 ? 'Good' : 'Needs Improvement'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Performance */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.byCategory.map((category, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">{category.category}</span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  category.compliance >= 95 ? 'bg-green-100 text-green-800' :
                  category.compliance >= 85 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {category.compliance}%
                </span>
              </div>
              <p className="text-sm text-gray-600">{category.count} tasks</p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    category.compliance >= 95 ? 'bg-green-500' :
                    category.compliance >= 85 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${category.compliance}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportsPM;