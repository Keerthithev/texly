import React, { useEffect, useState } from 'react';
import { getHistory } from '../services/reports';

export default function DashboardReports() {
  const [history, setHistory] = useState([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const data = await getHistory();
      setHistory(data);
    } catch (err) {
      setStatus('Failed to load reports');
    }
  };

  const totalSMS = history.length;
  const deliveredSMS = history.filter(sms => sms.status === 'delivered').length;
  const failedSMS = history.filter(sms => sms.status === 'failed').length;
  const pendingSMS = history.filter(sms => sms.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&q=80" alt="Reports" className="mr-4 rounded" />
          <div>
            <h1 className="text-3xl font-bold text-primary">
              SMS Reports
              <br />
              <span className="text-lg text-secondary">SMS වාර්තා</span>
            </h1>
            <p className="text-muted">
              View your SMS sending history and analytics
              <br />
              ඔබගේ SMS යැවීමේ ඉතිහාසය සහ විශ්ලේෂණය බලන්න
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Quick Stats */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-primary mb-4">
              Quick Stats
              <br />
              <span className="text-lg text-secondary">ඉක්මන් සංඛ්‍යාලේඛන</span>
            </h3>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{totalSMS}</div>
                <div className="text-sm text-muted">Total SMS Sent</div>
                <div className="text-xs text-secondary">මුළු SMS යැවූ</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{deliveredSMS}</div>
                <div className="text-sm text-muted">Delivered</div>
                <div className="text-xs text-secondary">බෙදාහැරීම්</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{failedSMS}</div>
                <div className="text-sm text-muted">Failed</div>
                <div className="text-xs text-secondary">අසාර්ථක</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{pendingSMS}</div>
                <div className="text-sm text-muted">Pending</div>
                <div className="text-xs text-secondary">පොරොත්තුවෙන්</div>
              </div>
            </div>
          </div>
        </div>

        {/* SMS History Table */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-primary mb-4">
              SMS History
              <br />
              <span className="text-lg text-secondary">SMS ඉතිහාසය</span>
            </h3>

            {status && (
              <div className="mb-4 p-3 rounded-md text-center bg-red-100 text-red-800">
                {status}
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="p-3 text-primary font-semibold">Message</th>
                    <th className="p-3 text-primary font-semibold">Recipients</th>
                    <th className="p-3 text-primary font-semibold">Status</th>
                    <th className="p-3 text-primary font-semibold">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map(sms => (
                    <tr key={sms._id} className="border-b hover:bg-gray-50">
                      <td className="p-3 text-sm">{sms.message}</td>
                      <td className="p-3 text-sm">{sms.recipients.join(', ')}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          sms.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          sms.status === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {sms.status}
                        </span>
                      </td>
                      <td className="p-3 text-sm text-muted">{new Date(sms.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {history.length === 0 && (
                <p className="text-center text-muted mt-4">No SMS history available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
