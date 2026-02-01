import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { toast } from 'react-toastify';
import { getContacts, addContact, updateContact, deleteContact } from '../services/contacts';

export default function DashboardContacts() {
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [group, setGroup] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteStep, setDeleteStep] = useState(1);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
  const [uploadPreview, setUploadPreview] = useState(null);
  const [showUploadConfirm, setShowUploadConfirm] = useState(false);

  const normalizePhone = (phone) => {
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('94') && cleaned.length === 11) {
      return '+' + cleaned;
    }
    if (cleaned.startsWith('0') && cleaned.length === 10) {
      return '+94' + cleaned.slice(1);
    }
    if (cleaned.length === 9) {
      return '+94' + cleaned;
    }
    if (cleaned.length === 11 && cleaned.startsWith('94')) {
      return '+' + cleaned;
    }
    return phone.startsWith('+') ? phone : '+' + phone;
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phoneNumber.includes(searchTerm) ||
    (contact.group && contact.group.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const data = await getContacts();
      setContacts(data);
    } catch (err) {
      setStatus('Failed to load contacts');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const normalizedPhone = normalizePhone(phoneNumber);
      if (!editingId) {
        // Check for duplicate phone
        const existingContact = contacts.find(c => c.phoneNumber === normalizedPhone);
        if (existingContact) {
          toast.error('A contact with this phone number already exists');
          return;
        }
      }
      if (editingId) {
        await updateContact(editingId, name, normalizedPhone, group);
        toast.success('Contact updated successfully!');
      } else {
        await addContact(name, normalizedPhone, group);
        toast.success('Contact added successfully!');
      }
      fetchContacts();
      resetForm();
    } catch (err) {
      toast.error('Failed to save contact');
    }
  };

  const handleEdit = (contact) => {
    setEditingId(contact._id);
    setName(contact.name);
    setPhoneNumber(contact.phoneNumber);
    setGroup(contact.group || '');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await deleteContact(id);
        toast.success('Contact deleted successfully!');
        fetchContacts();
      } catch (err) {
        toast.error('Failed to delete contact');
      }
    }
  };

  const resetForm = () => {
    setName('');
    setPhoneNumber('');
    setGroup('');
    setEditingId(null);
  };

  const handleContactSelect = (contactId) => {
    if (selectedContacts.includes(contactId)) {
      setSelectedContacts(selectedContacts.filter(id => id !== contactId));
    } else {
      setSelectedContacts([...selectedContacts, contactId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedContacts.length === filteredContacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(filteredContacts.map(c => c._id));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedContacts.length === 0) return;

    try {
      for (const id of selectedContacts) {
        await deleteContact(id);
      }
      toast.success(`${selectedContacts.length} contacts deleted successfully!`);
      setSelectedContacts([]);
      fetchContacts();
    } catch (err) {
      toast.error('Failed to delete selected contacts');
    }
    setShowDeleteConfirm(false);
  };

  const handlePhoneBlur = () => {
    if (phoneNumber.trim()) {
      const normalized = normalizePhone(phoneNumber);
      setPhoneNumber(normalized);
    }
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      let data = [];

      if (file.name.endsWith('.csv')) {
        const text = await file.text();
        const result = Papa.parse(text, { header: true, skipEmptyLines: true });
        data = result.data;
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        data = XLSX.utils.sheet_to_json(worksheet);
      } else {
        throw new Error('Unsupported file format');
      }

      // Process preview
      let validContacts = [];
      let duplicateCount = 0;
      let errorCount = 0;

      const existingPhones = contacts.map(c => c.phoneNumber);

      for (const row of data) {
        const contactData = {
          name: row.name || row.Name || '',
          phoneNumber: normalizePhone(row.phoneNumber || row.phone || row.Phone || row['Phone Number'] || ''),
          group: row.group || row.Group || ''
        };

        if (contactData.name && contactData.phoneNumber) {
          if (existingPhones.includes(contactData.phoneNumber)) {
            duplicateCount++;
          } else {
            validContacts.push(contactData);
          }
        } else {
          errorCount++;
        }
      }

      setUploadPreview({
        fileName: file.name,
        validContacts,
        duplicateCount,
        errorCount
      });
      setShowUploadConfirm(true);
    } catch (err) {
      toast.error('Failed to process file: ' + err.message);
      event.target.value = '';
    }
  };

  const handleConfirmUpload = async () => {
    if (!uploadPreview) return;

    setUploading(true);
    setShowUploadConfirm(false);
    try {
      let successCount = 0;

      for (const contact of uploadPreview.validContacts) {
        await addContact(contact.name, contact.phoneNumber, contact.group);
        successCount++;
      }

      await fetchContacts();
      toast.success(`Upload completed: ${successCount} contacts added, ${uploadPreview.duplicateCount} duplicates skipped, ${uploadPreview.errorCount} errors`);
    } catch (err) {
      toast.error('Failed to upload contacts');
    } finally {
      setUploading(false);
      setUploadPreview(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <img src="https://images.unsplash.com/photo-1556157382-97eda2d62296?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&q=80" alt="Contacts" className="mr-4 rounded" />
          <div>
            <h1 className="text-3xl font-bold text-primary">
              Manage Contacts
              <br />
              <span className="text-lg text-secondary">සම්බන්ධතා කළමනාකරණය</span>
            </h1>
            <p className="text-muted">
              Add, edit, and manage your contact list
              <br />
              සම්බන්ධතා ලැයිස්තුවට එකතු කර, සංස්කරණය කර සහ කළමනාකරණය කරන්න
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold text-primary mb-6">
              {editingId ? 'Edit Contact' : 'Add New Contact'}
              <br />
              <span className="text-lg text-secondary">{editingId ? 'සම්බන්ධතාවය සංස්කරණය කරන්න' : 'නව සම්බන්ධතාවය එකතු කරන්න'}</span>
            </h2>

            {/* File Upload Section */}
            {!editingId && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-primary mb-3">
                  Upload Contacts
                  <br />
                  <span className="text-sm text-secondary">සම්බන්ධතා උඩුගත කරන්න</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setShowUploadPopup(true)}
                  className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-primary font-semibold flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Upload Contacts File
                  <br />
                  <span className="text-xs ml-6">සම්බන්ධතා ගොනුව උඩුගත කරන්න</span>
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-muted mb-2">
                  Name / නම
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Enter contact name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-muted mb-2">
                  Phone Number / දුරකථන අංකය
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value)}
                  onBlur={handlePhoneBlur}
                  placeholder="Enter phone number (e.g., 0778043115)"
                  pattern="^\+?[0-9]{10,15}$"
                  title="Please enter a valid phone number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
                <p className="text-sm text-muted mt-1">
                  Phone number will be automatically formatted to +94XXXXXXXXX
                  <br />
                  දුරකථන අංකය ස්වයංක්‍රීයව +94XXXXXXXXX ආකාරයට ආකෘතිගත කරනු ලැබේ
                </p>
              </div>

              <div>
                <label className="block text-muted mb-2">
                  Group (Optional) / කණ්ඩායම (විකල්ප)
                </label>
                <input
                  type="text"
                  value={group}
                  onChange={e => setGroup(e.target.value)}
                  placeholder="Enter group name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary text-white py-3 px-4 rounded-md hover:bg-secondary font-semibold transition-colors"
                >
                  {editingId ? 'Update Contact' : 'Add Contact'}
                  <br />
                  <span className="text-sm">{editingId ? 'සම්බන්ධතාවය යාවත්කාලීන කරන්න' : 'සම්බන්ධතාවය එකතු කරන්න'}</span>
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

        {/* Contacts List */}
        <div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-primary mb-4">
              Your Contacts
              <br />
              <span className="text-lg text-secondary">ඔබගේ සම්බන්ධතා</span>
            </h3>

            <div className="mb-4 flex space-x-4">
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search contacts by name, phone, or group"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {selectedContacts.length > 0 && (
                <button
                  onClick={() => {
                    setShowDeleteConfirm(true);
                    setDeleteStep(1);
                    setDeleteConfirmationText('');
                  }}
                  className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  title={`Delete ${selectedContacts.length} selected contacts`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto">
              {contacts.length > 0 ? (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-center">
                        <input
                          type="checkbox"
                          checked={selectedContacts.length === filteredContacts.length && filteredContacts.length > 0}
                          onChange={handleSelectAll}
                          className="rounded"
                        />
                      </th>
                      <th className="px-4 py-2 text-left text-primary font-semibold">Name</th>
                      <th className="px-4 py-2 text-left text-primary font-semibold">Phone</th>
                      <th className="px-4 py-2 text-left text-primary font-semibold">Group</th>
                      <th className="px-4 py-2 text-center text-primary font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredContacts.map((contact) => (
                      <tr key={contact._id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2 text-center">
                          <input
                            type="checkbox"
                            checked={selectedContacts.includes(contact._id)}
                            onChange={() => handleContactSelect(contact._id)}
                            className="rounded"
                          />
                        </td>
                        <td className="px-4 py-2 font-medium text-primary">{contact.name}</td>
                        <td className="px-4 py-2 text-muted">{contact.phoneNumber}</td>
                        <td className="px-4 py-2 text-secondary">{contact.group || '-'}</td>
                        <td className="px-4 py-2 text-center">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => handleEdit(contact)}
                              className="text-blue-500 hover:text-blue-700 p-1"
                              title="Edit"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(contact._id)}
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
                  {contacts.length === 0 ? 'No contacts yet' : 'No contacts match your search'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Upload Popup */}
      {showUploadPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="bg-gradient-to-r from-primary to-secondary text-white p-6 rounded-t-lg">
              <div className="flex items-center">
                <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <div>
                  <h3 className="text-xl font-bold">
                    Upload Contacts File
                    <br />
                    <span className="text-lg opacity-90">සම්බන්ධතා ගොනුව උඩුගත කරන්න</span>
                  </h3>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h4 className="font-semibold text-primary mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  File Requirements
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="text-sm text-muted space-y-2">
                    <li className="flex items-start">
                      <svg className="w-4 h-4 mr-2 mt-0.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span><strong>Supported formats:</strong> CSV, Excel (.xlsx, .xls)</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 mr-2 mt-0.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span><strong>Name column:</strong> name, Name</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 mr-2 mt-0.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span><strong>Phone column:</strong> phoneNumber, phone, Phone, Phone Number</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 mr-2 mt-0.5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span><strong>Group column (optional):</strong> group, Group</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 mr-2 mt-0.5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>Phone numbers will be automatically formatted</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 mr-2 mt-0.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <span>Rows with missing name or phone will be skipped</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="flex space-x-4">
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileSelect}
                  disabled={uploading}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button
                  onClick={() => setShowUploadPopup(false)}
                  className="px-6 py-3 border border-gray-300 text-muted rounded-md hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                  <br />
                  <span className="text-xs">අවලංගු කරන්න</span>
                </button>
              </div>
              {uploading && (
                <div className="mt-4 p-3 bg-blue-50 text-blue-800 rounded-md flex items-center">
                  <svg className="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Uploading and processing file...
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-t-lg">
              <div className="flex items-center">
                <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <h3 className="text-xl font-bold">
                    {deleteStep === 1 ? 'Confirm Deletion' : 'Final Confirmation'}
                  </h3>
                  <p className="text-sm opacity-90">
                    {deleteStep === 1 ? 'This action cannot be undone' : 'Type "DELETE" to confirm'}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6">
              {deleteStep === 1 ? (
                <>
                  <p className="text-gray-700 mb-6">
                    Are you sure you want to delete <strong>{selectedContacts.length}</strong> selected contact{selectedContacts.length > 1 ? 's' : ''}?
                    <br />
                    This will permanently remove them from your contact list.
                  </p>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setDeleteStep(2)}
                      className="flex-1 bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 font-semibold transition-colors"
                    >
                      Yes, Continue
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-50 font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-gray-700 mb-4">
                    To confirm deletion, please type <strong>"DELETE"</strong> in the box below:
                  </p>
                  <input
                    type="text"
                    value={deleteConfirmationText}
                    onChange={(e) => setDeleteConfirmationText(e.target.value)}
                    placeholder="Type DELETE to confirm"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent mb-6"
                  />
                  <div className="flex space-x-4">
                    <button
                      onClick={handleDeleteSelected}
                      disabled={deleteConfirmationText !== 'DELETE'}
                      className="flex-1 bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors"
                    >
                      Delete Permanently
                    </button>
                    <button
                      onClick={() => setDeleteStep(1)}
                      className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-50 font-semibold transition-colors"
                    >
                      Back
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Upload Confirmation Modal */}
      {showUploadConfirm && uploadPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="bg-gradient-to-r from-primary to-secondary text-white p-6 rounded-t-lg">
              <div className="flex items-center">
                <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="text-xl font-bold">Confirm Upload</h3>
                  <p className="text-sm opacity-90">Review before adding contacts</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <p className="text-gray-700 mb-2"><strong>File:</strong> {uploadPreview.fileName}</p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-600">{uploadPreview.validContacts.length}</div>
                      <div className="text-sm text-gray-600">To Add</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-yellow-600">{uploadPreview.duplicateCount}</div>
                      <div className="text-sm text-gray-600">Duplicates</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-600">{uploadPreview.errorCount}</div>
                      <div className="text-sm text-gray-600">Errors</div>
                    </div>
                  </div>
                </div>
              </div>
              {uploadPreview.validContacts.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-primary mb-2">Preview (first 5 contacts):</h4>
                  <div className="bg-gray-50 p-3 rounded max-h-32 overflow-y-auto">
                    {uploadPreview.validContacts.slice(0, 5).map((contact, index) => (
                      <div key={index} className="text-sm py-1 border-b border-gray-200 last:border-b-0">
                        {contact.name} - {contact.phoneNumber} {contact.group && `(${contact.group})`}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex space-x-4">
                <button
                  onClick={handleConfirmUpload}
                  disabled={uploading}
                  className="flex-1 bg-primary text-white py-3 px-4 rounded-md hover:bg-secondary disabled:opacity-50 font-semibold transition-colors"
                >
                  {uploading ? 'Adding Contacts...' : 'Add Contacts'}
                </button>
                <button
                  onClick={() => {
                    setShowUploadConfirm(false);
                    setUploadPreview(null);
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-50 font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
