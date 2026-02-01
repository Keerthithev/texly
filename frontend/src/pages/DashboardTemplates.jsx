import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getTemplates, addTemplate, updateTemplate, deleteTemplate } from '../services/templates';

export default function DashboardTemplates() {
  const [templates, setTemplates] = useState([]);
  const [templateName, setTemplateName] = useState('');
  const [templateText, setTemplateText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTemplates = templates.filter(template =>
    template.templateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.templateText.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const data = await getTemplates();
      setTemplates(data);
    } catch (err) {
      toast.error('Failed to load templates');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateTemplate(editingId, templateName, templateText);
        toast.success('Template updated successfully!');
      } else {
        await addTemplate(templateName, templateText);
        toast.success('Template added successfully!');
      }
      fetchTemplates();
      resetForm();
    } catch (err) {
      toast.error('Failed to save template');
    }
  };

  const handleEdit = (template) => {
    setEditingId(template._id);
    setTemplateName(template.templateName);
    setTemplateText(template.templateText);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        await deleteTemplate(id);
        toast.success('Template deleted successfully!');
        fetchTemplates();
      } catch (err) {
        toast.error('Failed to delete template');
      }
    }
  };

  const resetForm = () => {
    setTemplateName('');
    setTemplateText('');
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <img src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&q=80" alt="Templates" className="mr-4 rounded" />
          <div>
            <h1 className="text-3xl font-bold text-primary">
              Manage Templates
              <br />
              <span className="text-lg text-secondary">ආකෘති කළමනාකරණය</span>
            </h1>
            <p className="text-muted">
              Create and manage SMS templates for quick messaging
              <br />
              ඉක්මන් පණිවිඩ සඳහා SMS ආකෘති නිර්මාණය කර සහ කළමනාකරණය කරන්න
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold text-primary mb-6">
              {editingId ? 'Edit Template' : 'Create New Template'}
              <br />
              <span className="text-lg text-secondary">{editingId ? 'ආකෘතිය සංස්කරණය කරන්න' : 'නව ආකෘතිය නිර්මාණය කරන්න'}</span>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-muted mb-2">
                  Template Name / ආකෘති නම
                </label>
                <input
                  type="text"
                  value={templateName}
                  onChange={e => setTemplateName(e.target.value)}
                  placeholder="Enter template name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-muted mb-2">
                  Template Text / ආකෘති පෙළ
                </label>
                <textarea
                  value={templateText}
                  onChange={e => setTemplateText(e.target.value)}
                  placeholder="Enter template message"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={6}
                  maxLength={160}
                  required
                />
                <p className="text-sm text-muted mt-1">
                  {templateText.length}/160 characters
                </p>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary text-white py-3 px-4 rounded-md hover:bg-secondary font-semibold transition-colors"
                >
                  {editingId ? 'Update Template' : 'Create Template'}
                  <br />
                  <span className="text-sm">{editingId ? 'ආකෘතිය යාවත්කාලීන කරන්න' : 'ආකෘතිය නිර්මාණය කරන්න'}</span>
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-md hover:bg-gray-600 font-semibold transition-colors"
                  >
                    Cancel
                    <br />
                    <span className="text-sm">අවලංගු කරන්න</span>
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Templates List */}
        <div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-primary mb-4">
              Your Templates
              <br />
              <span className="text-lg text-secondary">ඔබගේ ආකෘති</span>
            </h3>

            <div className="mb-4">
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search templates by name or content"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="max-h-96 overflow-y-auto">
              {filteredTemplates.length > 0 ? (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-primary font-semibold">Name</th>
                      <th className="px-4 py-2 text-left text-primary font-semibold">Content</th>
                      <th className="px-4 py-2 text-center text-primary font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTemplates.map((template) => (
                      <tr key={template._id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2 font-medium text-primary">{template.templateName}</td>
                        <td className="px-4 py-2 text-muted truncate max-w-xs" title={template.templateText}>
                          {template.templateText}
                        </td>
                        <td className="px-4 py-2 text-center">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => handleEdit(template)}
                              className="text-blue-500 hover:text-blue-700 p-1"
                              title="Edit"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(template._id)}
                              className="text-red-500 hover:text-red-700 p-1"
                              title="Delete"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-muted text-center py-8">
                  {templates.length === 0 ? 'No templates yet' : 'No templates match your search'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
