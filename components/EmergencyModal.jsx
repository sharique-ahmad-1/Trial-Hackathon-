'use client';

import React from 'react';
import { PhoneCall, ShieldAlert, X, AlertTriangle, UserCheck, HeartHandshake } from 'lucide-react';

export default function EmergencyModal({ isOpen, onClose, profile }) {
  if (!isOpen) return null;

  const contacts = [
    {
      name: profile?.emergency_contact_name || 'Dr. Sunita Sharma (Daughter)',
      role: 'Primary Family Caregiver',
      phone: profile?.emergency_contact_phone || '+91 98765 43210',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
      borderColor: 'border-emerald-500',
      btnColor: 'bg-emerald-600 hover:bg-emerald-700'
    },
    {
      name: 'Dr. V. K. Mehta (Family Physician)',
      role: 'Heart & General Specialist',
      phone: '+91 98111 22334',
      bgColor: 'bg-blue-50 dark:bg-blue-950/40',
      borderColor: 'border-blue-500',
      btnColor: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      name: 'National Emergency Ambulance (108)',
      role: 'Immediate 24/7 Medical Response',
      phone: '108',
      bgColor: 'bg-rose-50 dark:bg-rose-950/40',
      borderColor: 'border-rose-500',
      btnColor: 'bg-rose-600 hover:bg-rose-700'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border-4 border-rose-500 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-rose-500/30">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-rose-600 dark:text-rose-400">Emergency Assistance</h2>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Tap to call your caregiver or doctor immediately</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="touch-target p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Medical Snapshot for Emergency Responders */}
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700 space-y-1 text-sm">
          <div className="font-black text-amber-800 dark:text-amber-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Emergency Patient Details:
          </div>
          <p className="text-slate-700 dark:text-slate-200">
            <strong>Patient:</strong> {profile?.full_name || 'Ramesh Sharma'} • <strong>Age:</strong> {profile?.age || 68} • <strong>Blood Group:</strong> {profile?.blood_group || 'B+'}
          </p>
          <p className="text-slate-700 dark:text-slate-200">
            <strong>Known Conditions:</strong> {(profile?.medical_conditions || ['Hypertension', 'Arthritis']).join(', ')}
          </p>
        </div>

        {/* Contact List */}
        <div className="space-y-3">
          {contacts.map((c, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border-2 ${c.borderColor} ${c.bgColor} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3`}
            >
              <div>
                <h4 className="font-extrabold text-base text-slate-900 dark:text-white">{c.name}</h4>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{c.role}</p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">{c.phone}</p>
              </div>

              <a
                href={`tel:${c.phone}`}
                className={`w-full sm:w-auto touch-target px-5 py-3 rounded-xl ${c.btnColor} text-white font-black text-base shadow-md flex items-center justify-center gap-2`}
              >
                <PhoneCall className="w-5 h-5" />
                <span>Call Now</span>
              </a>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full touch-target py-3 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-base hover:bg-slate-300 transition-all"
        >
          Close Emergency Window
        </button>
      </div>
    </div>
  );
}
