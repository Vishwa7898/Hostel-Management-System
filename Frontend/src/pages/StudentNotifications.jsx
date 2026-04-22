import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import StudentShell from '../components/layout/StudentShell';

export default function StudentNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!token) return navigate('/');
    if (['Admin', 'Warden', 'Accountant'].includes(user.role)) return navigate('/admin-notifications');
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/notifications/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setNotifications(Array.isArray(data) ? data : []);
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotifications();
    } catch {
      // Ignore request error and keep the current list.
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch('http://localhost:5000/api/notifications/read-all', {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotifications();
    } catch {
      // Ignore request error and keep the current list.
    }
  };

  return (
    <StudentShell
      activeKey="notifications"
      title="Notifications"
      subtitle="View return-time alerts and attendance messages."
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-bold text-slate-800">
            <Bell size={20} className="text-red-500" />
            My Notifications
          </h2>
          <button
            type="button"
            onClick={markAllAsRead}
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
          >
            Mark All as Read
          </button>
        </div>

        {loading ? (
          <p className="rounded-lg bg-slate-50 p-4 text-slate-500">Loading notifications...</p>
        ) : notifications.length === 0 ? (
          <p className="rounded-lg bg-slate-50 p-4 text-slate-500">No notifications found.</p>
        ) : (
          <div className="space-y-3">
            {notifications.map((note) => (
              <div
                key={note._id}
                className={`rounded-xl border p-4 ${note.isRead ? 'border-slate-200 bg-slate-50' : 'border-red-200 bg-red-50'}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-800">{note.title}</p>
                    <p className="mt-1 text-sm text-slate-600">{note.message}</p>
                    <p className="mt-2 text-xs text-slate-400">
                      {note.createdAt ? new Date(note.createdAt).toLocaleString() : ''}
                    </p>
                  </div>
                  {!note.isRead && (
                    <button
                      type="button"
                      onClick={() => markAsRead(note._id)}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </StudentShell>
  );
}
