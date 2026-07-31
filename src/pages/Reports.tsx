import React, { useState } from 'react';
import { useGymData } from '../context/GymDataContext';
import { FileText, Download, Printer, CheckCircle2, FileSpreadsheet } from 'lucide-react';

export const Reports: React.FC = () => {
  const { members, payments, attendance, inventory } = useGymData();
  const [reportType, setReportType] = useState<'financial' | 'members' | 'attendance' | 'inventory'>('financial');
  const [generatedMsg, setGeneratedMsg] = useState<string | null>(null);

  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    if (reportType === 'financial') {
      csvContent += 'InvoiceNo,MemberName,Amount,PaymentMethod,Date,Status\n';
      payments.forEach(p => {
        csvContent += `${p.invoiceNo},"${p.memberName}",${p.amount},${p.paymentMethod},${p.paymentDate},${p.status}\n`;
      });
    } else if (reportType === 'members') {
      csvContent += 'MemberCode,Name,Email,Plan,Status,JoinDate,ExpiryDate\n';
      members.forEach(m => {
        csvContent += `${m.memberCode},"${m.name}",${m.email},"${m.planName}",${m.status},${m.joinDate},${m.expiryDate}\n`;
      });
    } else if (reportType === 'attendance') {
      csvContent += 'MemberCode,Name,CheckInTime,Method,Status\n';
      attendance.forEach(a => {
        csvContent += `${a.memberCode},"${a.memberName}",${a.checkInTime},${a.method},${a.status}\n`;
      });
    } else {
      csvContent += 'SKU,Name,Category,Quantity,Price,Status\n';
      inventory.forEach(i => {
        csvContent += `${i.sku},"${i.name}",${i.category},${i.quantity},${i.unitPrice},${i.status}\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `fitcore_${reportType}_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setGeneratedMsg(`Successfully generated & downloaded FitCore ${reportType.toUpperCase()} CSV report!`);
    setTimeout(() => setGeneratedMsg(null), 4000);
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            Executive Reports & Export Audit Center
          </h1>
          <p className="text-xs text-slate-400">Generate compliance reports, revenue ledgers, membership rosters, and inventory stock audits.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrintReport}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print View</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-cyan-500/20"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV Report</span>
          </button>
        </div>
      </div>

      {/* Report Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { id: 'financial', label: 'Financial Revenue Ledger' },
          { id: 'members', label: 'Member Retention Roster' },
          { id: 'attendance', label: 'Attendance Audit Logs' },
          { id: 'inventory', label: 'Pro-Shop Stock Audit' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setReportType(t.id as any)}
            className={`p-4 rounded-2xl text-left border transition-all ${
              reportType === t.id
                ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40 shadow-lg shadow-cyan-500/5'
                : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <span className="text-xs font-bold block">{t.label}</span>
            <span className="text-[10px] text-slate-500 mt-1 block">Click to prepare report data</span>
          </button>
        ))}
      </div>

      {generatedMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{generatedMsg}</span>
        </div>
      )}

      {/* Preview Sheet */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800/80 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              FitCore AI Official Executive Audit Report: <span className="text-cyan-400">{reportType.toUpperCase()}</span>
            </h3>
            <p className="text-xs text-slate-400 font-mono">Generated: {new Date().toLocaleString()}</p>
          </div>
          <FileSpreadsheet className="w-6 h-6 text-cyan-400" />
        </div>

        <div className="overflow-x-auto">
          {reportType === 'financial' && (
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/60 text-slate-400 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Invoice #</th>
                  <th className="py-2.5 px-3">Member Name</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {payments.map(p => (
                  <tr key={p.id}>
                    <td className="py-2 px-3 font-mono text-cyan-400">{p.invoiceNo}</td>
                    <td className="py-2 px-3 font-semibold text-slate-100">{p.memberName}</td>
                    <td className="py-2 px-3 font-bold text-emerald-400">${p.amount}</td>
                    <td className="py-2 px-3 font-mono">{p.paymentDate}</td>
                    <td className="py-2 px-3 uppercase text-[10px] font-bold text-emerald-400">{p.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'members' && (
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/60 text-slate-400 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Member Code</th>
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3">Plan</th>
                  <th className="py-2.5 px-3">Expiry Date</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {members.map(m => (
                  <tr key={m.id}>
                    <td className="py-2 px-3 font-mono text-cyan-400">{m.memberCode}</td>
                    <td className="py-2 px-3 font-semibold text-slate-100">{m.name}</td>
                    <td className="py-2 px-3">{m.planName}</td>
                    <td className="py-2 px-3 font-mono">{m.expiryDate}</td>
                    <td className="py-2 px-3 uppercase text-[10px] font-bold text-cyan-400">{m.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
