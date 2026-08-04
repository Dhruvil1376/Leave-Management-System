import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSettings, FiBell, FiMail, FiShield, FiSave, FiGrid } from 'react-icons/fi';
import Breadcrumb from '../../components/ui/Breadcrumb';
import { useToast } from '../../context/ToastContext';
import Spinner from '../../components/ui/Spinner';

const tabs = [
  { id: 'company', label: 'Company', icon: <FiGrid size={15} /> },
  { id: 'leave', label: 'Leave Policy', icon: <FiSettings size={15} /> },
  { id: 'email', label: 'Email', icon: <FiMail size={15} /> },
  { id: 'notifications', label: 'Notifications', icon: <FiBell size={15} /> },
  { id: 'security', label: 'Security', icon: <FiShield size={15} /> },
];

export default function Settings() {
  const { success } = useToast();
  const [activeTab, setActiveTab] = useState('company');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    success('Settings saved successfully');
  };

  return (
    <div>
      <Breadcrumb items={[{ label: 'Settings' }]} />
      <div className="page-header">
        <div><h1 className="page-title">Settings</h1><p className="page-subtitle">Manage company and system settings</p></div>
      </div>

      <div className="flex gap-6">
        {/* Tab Nav */}
        <div className="shrink-0 w-44">
          <nav className="space-y-1">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <motion.div key={activeTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex-1 card p-6">
          {activeTab === 'company' && (
            <div className="space-y-5">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Company Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="label">Company Name</label><input type="text" className="input" defaultValue="Acme Corporation" /></div>
                <div><label className="label">Industry</label><input type="text" className="input" defaultValue="Technology" /></div>
                <div><label className="label">Website</label><input type="url" className="input" defaultValue="https://acme.com" /></div>
                <div><label className="label">Phone</label><input type="tel" className="input" defaultValue="+1 555-0100" /></div>
                <div className="sm:col-span-2"><label className="label">Address</label><textarea rows={2} className="input resize-none" defaultValue="123 Business Ave, San Francisco, CA 94105" /></div>
              </div>
            </div>
          )}
          {activeTab === 'leave' && (
            <div className="space-y-5">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Leave Policies</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[['Casual Leave (days/year)', '12'], ['Sick Leave (days/year)', '10'], ['Earned Leave (days/year)', '20'], ['Maternity Leave (days)', '90'], ['Paternity Leave (days)', '15'], ['Max consecutive days', '14']].map(([l, v]) => (
                  <div key={l}><label className="label">{l}</label><input type="number" className="input" defaultValue={v} /></div>
                ))}
              </div>
              <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                {['Allow leave carry-forward', 'Require manager approval', 'Allow half-day leaves', 'Send email notifications'].map(label => (
                  <label key={label} className="flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-primary-600 border-gray-300" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'email' && (
            <div className="space-y-5">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Email Configuration</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[['SMTP Host', 'smtp.gmail.com'], ['SMTP Port', '587'], ['From Email', 'hr@acme.com'], ['From Name', 'Acme HR']].map(([l, v]) => (
                  <div key={l}><label className="label">{l}</label><input type="text" className="input" defaultValue={v} /></div>
                ))}
                <div><label className="label">Username</label><input type="text" className="input" placeholder="SMTP username" /></div>
                <div><label className="label">Password</label><input type="password" className="input" placeholder="SMTP password" /></div>
              </div>
            </div>
          )}
          {activeTab === 'notifications' && (
            <div className="space-y-5">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Notification Preferences</h3>
              <div className="space-y-4">
                {[
                  { label: 'Leave application submitted', desc: 'Notify manager when employee applies for leave' },
                  { label: 'Leave approved/rejected', desc: 'Notify employee when their request is processed' },
                  { label: 'Upcoming holiday reminders', desc: 'Send reminder 2 days before a public holiday' },
                  { label: 'Leave balance low', desc: 'Alert when balance drops below 3 days' },
                  { label: 'Monthly reports', desc: 'Send monthly leave summary to HR' },
                ].map(n => (
                  <div key={n.label} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{n.label}</p>
                      <p className="text-xs text-gray-400">{n.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:ring-2 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'security' && (
            <div className="space-y-5">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Security Settings</h3>
              <div className="space-y-4">
                {[
                  { label: 'Two-factor authentication', desc: 'Require 2FA for all admin accounts' },
                  { label: 'Password expiry (90 days)', desc: 'Force password change every 90 days' },
                  { label: 'Session timeout (30 min)', desc: 'Auto-logout after 30 minutes of inactivity' },
                  { label: 'Login attempt limit', desc: 'Lock account after 5 failed login attempts' },
                ].map(n => (
                  <div key={n.label} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{n.label}</p>
                      <p className="text-xs text-gray-400">{n.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:ring-2 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex justify-end mt-6 pt-5 border-t border-gray-100 dark:border-gray-800">
            <button className="btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? <Spinner size="sm" /> : <><FiSave size={14} /> Save Settings</>}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
