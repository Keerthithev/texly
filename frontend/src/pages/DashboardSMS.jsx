import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { getTemplates } from '../services/templates';
import { getContacts } from '../services/contacts';

export default function DashboardSMS() {
  const [recipients, setRecipients] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [templates, setTemplates] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [showContacts, setShowContacts] = useState(false);
  const [contactSearchTerm, setContactSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [uploadingNumbers, setUploadingNumbers] = useState(false);
  const [uploadNumbersPreview, setUploadNumbersPreview] = useState(null);
  const [showNumbersConfirm, setShowNumbersConfirm] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  const filteredContactsForSelector = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(contactSearchTerm.toLowerCase()) ||
                          contact.phoneNumber.includes(contactSearchTerm);
    const matchesGroup = !selectedGroup || contact.group === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  const uniqueGroups = [...new Set(contacts.map(c => c.group).filter(g => g))];

  const handleSelectAll = () => {
    if (selectedContacts.length === filteredContactsForSelector.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(filteredContactsForSelector.map(c => c._id));
    }
  };

  useEffect(() => {
    fetchTemplates();
    fetchContacts();
  }, []);

  const fetchTemplates = async () => {
    try {
      const data = await getTemplates();
      setTemplates(data);
    } catch (err) {
      console.error('Failed to load templates');
    }
  };

  const fetchContacts = async () => {
    try {
      const data = await getContacts();
      setContacts(data);
    } catch (err) {
      console.error('Failed to load contacts');
    }
  };

  const normalizePhone = (phone) => {
    // Remove all non-digit characters
    let cleaned = phone.replace(/\D/g, '');
    // If starts with 94 and has 11 digits, add +
    if (cleaned.startsWith('94') && cleaned.length === 11) {
      return '+' + cleaned;
    }
    // If starts with 0 and has 10 digits, replace 0 with +94
    if (cleaned.startsWith('0') && cleaned.length === 10) {
      return '+94' + cleaned.slice(1);
    }
    // If has 9 digits, add +94
    if (cleaned.length === 9) {
      return '+94' + cleaned;
    }
    // If has 11 digits starting with 94, add +
    if (cleaned.length === 11 && cleaned.startsWith('94')) {
      return '+' + cleaned;
    }
    // Otherwise, assume it's already correct or add + if not present
    return phone.startsWith('+') ? phone : '+' + phone;
  };

  const handleSend = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const normalizedRecipients = recipients.split(',').map(s => normalizePhone(s.trim())).filter(s => s);
      await axios.post('/api/sms/send', {
        recipients: normalizedRecipients,
        message,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStatus('SMS sent successfully!');
      setRecipients('');
      setMessage('');
    } catch (err) {
      setStatus('Failed to send SMS');
    }
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template._id);
    setMessage(template.templateText);
  };

  const handleContactSelect = (contact) => {
    if (selectedContacts.includes(contact._id)) {
      setSelectedContacts(selectedContacts.filter(id => id !== contact._id));
    } else {
      setSelectedContacts([...selectedContacts, contact._id]);
    }
  };

  const addSelectedContacts = () => {
    const selectedPhones = contacts
      .filter(contact => selectedContacts.includes(contact._id))
      .map(contact => contact.phoneNumber);
    const currentRecipients = recipients ? recipients.split(',').map(s => s.trim()) : [];
    const newRecipients = [...new Set([...currentRecipients, ...selectedPhones])];
    setRecipients(newRecipients.join(', '));
    setSelectedContacts([]);
    setShowContacts(false);
  };

  const handleFileSelectForNumbers = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      let numbers = [];

      if (file.name.endsWith('.csv')) {
        const text = await file.text();
        const result = Papa.parse(text, { header: true, skipEmptyLines: true });
        numbers = result.data.map(row => {
          return row.phoneNumber || row.phone || row.Phone || row['Phone Number'] || row.number || row.Number || '';
        }).filter(num => num);
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);
        numbers = data.map(row => {
          return row.phoneNumber || row.phone || row.Phone || row['Phone Number'] || row.number || row.Number || '';
        }).filter(num => num);
      } else {
        throw new Error('Unsupported file format');
      }

      const normalizedNumbers = numbers.map(num => normalizePhone(num)).filter(num => num);
      if (normalizedNumbers.length === 0) {
        setUploadStatus('No valid phone numbers found in the file');
        event.target.value = '';
        return;
      }
      setUploadNumbersPreview({
        fileName: file.name,
        numbers: normalizedNumbers,
        count: normalizedNumbers.length
      });
      setShowNumbersConfirm(true);
    } catch (err) {
      setUploadStatus('Failed to process file: ' + err.message);
      event.target.value = '';
    }
  };

  const handleConfirmUploadNumbers = () => {
    if (!uploadNumbersPreview) return;

    const currentRecipients = recipients ? recipients.split(',').map(s => s.trim()) : [];
    const newRecipients = [...new Set([...currentRecipients, ...uploadNumbersPreview.numbers])];
    setRecipients(newRecipients.join(', '));
    setStatus(`Added ${uploadNumbersPreview.count} phone numbers from file`);
    setShowNumbersConfirm(false);
    setUploadNumbersPreview(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <img src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=60&q=80" alt="SMS" className="mr-4 rounded" />
          <div>
            <h1 className="text-3xl font-bold text-primary">
              Send SMS
              <br />
              <span className="text-lg text-secondary">SMS යවන්න</span>
            </h1>
            <p className="text-muted">
              Send individual or bulk SMS messages
              <br />
              තනිකම හෝ බෑලි SMS පණිවිඩ යවන්න
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SMS Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold text-primary mb-6 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Compose Message
              <br />
              <span className="text-lg text-secondary ml-8">පණිවිඩය සකසන්න</span>
            </h2>

            <form onSubmit={handleSend} className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-primary font-medium mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Recipients / ලබන්නන්
                </label>
                <input
                  type="text"
                  value={recipients}
                  onChange={e => setRecipients(e.target.value)}
                  placeholder="Enter phone numbers separated by commas (e.g., +1234567890, +0987654321)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
                <p className="text-sm text-muted mt-2 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Enter phone numbers with country code
                  <br />
                  <span className="ml-5">රටේ කේතය සමඟ දුරකථන අංක ආදානය කරන්න</span>
                </p>
                <div className="flex space-x-2 mt-3">
                  <button
                    type="button"
                    onClick={() => setShowContacts(!showContacts)}
                    className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-primary font-semibold transition-colors flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    {showContacts ? 'Hide Contacts' : 'Select from Contacts'}
                    <br />
                    <span className="text-xs ml-6">{showContacts ? 'සම්බන්ධතා සැඟවීම' : 'සම්බන්ධතා වලින් තෝරන්න'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowFileUpload(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-semibold transition-colors flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Upload Contacts
                    <br />
                    <span className="text-xs ml-6">සම්බන්ධතා උඩුගත කරන්න</span>
                  </button>
                </div>
                {showContacts && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-md max-h-96">
                    <h4 className="font-semibold text-primary mb-3">
                      Select Contacts
                      <br />
                      <span className="text-sm text-secondary">සම්බන්ධතා තෝරන්න</span>
                    </h4>

                    <div className="mb-4 space-y-2">
                      <input
                        type="text"
                        value={contactSearchTerm}
                        onChange={e => setContactSearchTerm(e.target.value)}
                        placeholder="Search contacts..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      />
                      <select
                        value={selectedGroup}
                        onChange={e => setSelectedGroup(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      >
                        <option value="">All Groups</option>
                        {uniqueGroups.map(group => (
                          <option key={group} value={group}>{group}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center justify-between mb-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedContacts.length === filteredContactsForSelector.length && filteredContactsForSelector.length > 0}
                          onChange={handleSelectAll}
                          className="rounded"
                        />
                        <span className="text-sm font-medium">Select All</span>
                      </label>
                      <span className="text-sm text-muted">
                        {selectedContacts.length} selected
                      </span>
                    </div>

                    <div className="max-h-48 overflow-y-auto space-y-2">
                      {filteredContactsForSelector.map((contact) => (
                        <label key={contact._id} className="flex items-center space-x-2 p-2 hover:bg-white rounded">
                          <input
                            type="checkbox"
                            checked={selectedContacts.includes(contact._id)}
                            onChange={() => handleContactSelect(contact)}
                            className="rounded"
                          />
                          <div className="flex-1">
                            <div className="text-sm font-medium">{contact.name}</div>
                            <div className="text-xs text-muted">{contact.phoneNumber}</div>
                            {contact.group && <div className="text-xs text-secondary">{contact.group}</div>}
                          </div>
                        </label>
                      ))}
                      {filteredContactsForSelector.length === 0 && (
                        <p className="text-sm text-muted text-center py-4">No contacts found</p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={addSelectedContacts}
                      disabled={selectedContacts.length === 0}
                      className="mt-3 w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary disabled:opacity-50 font-semibold"
                    >
                      Add to Recipients ({selectedContacts.length})
                      <br />
                      <span className="text-xs">ලබන්නන්ට එකතු කරන්න</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-primary font-medium mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Message / පණිවිඩය
                </label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Type your message here..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  rows={6}
                  maxLength={160}
                  required
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-muted flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {message.length}/160 characters
                  </p>
                  {message.length > 140 && (
                    <span className={`text-sm font-medium ${message.length > 160 ? 'text-red-500' : 'text-yellow-500'}`}>
                      {160 - message.length} left
                    </span>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-white py-3 px-4 rounded-md hover:bg-secondary font-semibold transition-colors flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Send SMS
                <br />
                <span className="ml-7">SMS යවන්න</span>
              </button>
            </form>

            {status && (
              <div className={`mt-4 p-3 rounded-md text-center ${
                status.includes('successfully')
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {status}
              </div>
            )}
          </div>
        </div>

        {/* Templates Sidebar */}
        <div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-primary mb-4">
              SMS Templates
              <br />
              <span className="text-lg text-secondary">SMS ආකෘති</span>
            </h3>

            <div className="space-y-3">
              {templates.map((template) => (
                <div
                  key={template._id}
                  onClick={() => handleTemplateSelect(template)}
                  className={`p-3 border rounded-md cursor-pointer transition-colors ${
                    selectedTemplate === template._id
                      ? 'border-primary bg-primary bg-opacity-10'
                      : 'border-gray-200 hover:border-primary'
                  }`}
                >
                  <h4 className="font-medium text-primary">{template.templateName}</h4>
                  <p className="text-sm text-muted mt-1">{template.templateText}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-background rounded-md">
              <h4 className="font-semibold text-primary mb-2">
                Quick Stats
                <br />
                <span className="text-sm text-secondary">ඉක්මන් සංඛ්‍යාලේඛන</span>
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>SMS Sent Today:</span>
                  <span className="font-semibold">45</span>
                </div>
                <div className="flex justify-between">
                  <span>Remaining:</span>
                  <span className="font-semibold">9,955</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* File Upload Modal */}
      {showFileUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4 text-primary">
              Upload Phone Numbers
              <br />
              <span className="text-lg text-secondary">දුරකථන අංක උඩුගත කරන්න</span>
            </h3>
            <div className="mb-4">
              <h4 className="font-medium text-primary mb-2">File Requirements:</h4>
              <ul className="text-sm text-muted space-y-1">
                <li>• Supported formats: CSV, Excel (.xlsx, .xls)</li>
                <li>• Column name should be: phoneNumber, phone, Phone, Phone Number, number, or Number</li>
                <li>• Each row should contain one phone number</li>
                <li>• Phone numbers will be automatically formatted</li>
              </ul>
            </div>
            <div className="flex space-x-4">
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileSelectForNumbers}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={() => {
                  setShowFileUpload(false);
                  setUploadStatus('');
                }}
                className="px-4 py-2 border border-gray-300 text-muted rounded-md hover:bg-gray-50"
              >
                Cancel
                <br />
                <span className="text-xs">අවලංගු කරන්න</span>
              </button>
            </div>
            {uploadStatus && (
              <div className={`mt-4 p-3 rounded-md text-center ${
                uploadStatus.includes('successfully') || uploadStatus.includes('Added')
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {uploadStatus}
              </div>
            )}
            {uploadingNumbers && (
              <p className="text-sm text-primary mt-2">Uploading and processing file...</p>
            )}
          </div>
        </div>
      )}

      {/* Numbers Upload Confirmation Modal */}
      {showNumbersConfirm && uploadNumbersPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-t-lg">
              <div className="flex items-center">
                <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="text-xl font-bold">Confirm Upload</h3>
                  <p className="text-sm opacity-90">Add phone numbers to recipients</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <p className="text-gray-700 mb-2"><strong>File:</strong> {uploadNumbersPreview.fileName}</p>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-green-600">{uploadNumbersPreview.count}</div>
                  <div className="text-sm text-gray-600">Phone numbers to add</div>
                </div>
              </div>
              {uploadNumbersPreview.numbers.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-primary mb-2">Preview (first 5 numbers):</h4>
                  <div className="bg-gray-50 p-3 rounded max-h-32 overflow-y-auto">
                    {uploadNumbersPreview.numbers.slice(0, 5).map((num, index) => (
                      <div key={index} className="text-sm py-1 border-b border-gray-200 last:border-b-0">
                        {num}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex space-x-4">
                <button
                  onClick={handleConfirmUploadNumbers}
                  className="flex-1 bg-primary text-white py-3 px-4 rounded-md hover:bg-secondary disabled:opacity-50 font-semibold transition-colors"
                >
                  Add to Recipients
                </button>
                <button
                  onClick={() => {
                    setShowNumbersConfirm(false);
                    setUploadNumbersPreview(null);
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
