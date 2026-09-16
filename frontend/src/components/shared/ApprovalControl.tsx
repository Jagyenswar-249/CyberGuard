import React, { useState } from 'react';
import { CheckCircle2, XCircle, AlertOctagon, Send } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ApprovalControlProps {
  incidentId: string;
  currentStatus: string;
  onApprove: (notes: string) => void;
  onDismiss: (notes: string) => void;
  onEscalate: (notes: string) => void;
}

export const ApprovalControl: React.FC<ApprovalControlProps> = ({
  currentStatus,
  onApprove,
  onDismiss,
  onEscalate
}) => {
  const [notes, setNotes] = useState('');
  const [actionDone, setActionDone] = useState<string | null>(null);

  const handleApprove = () => {
    onApprove(notes);
    setActionDone('Approved & Contained');
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#14b8a6', '#22c55e', '#f59e0b']
      });
    } catch {
      // ignore
    }
  };

  const handleDismiss = () => {
    onDismiss(notes);
    setActionDone('Dismissed as False Positive');
  };

  const handleEscalate = () => {
    onEscalate(notes);
    setActionDone('Escalated to Tier-3 SOC');
  };

  const isClosed = currentStatus === 'Contained' || currentStatus === 'Dismissed';

  if (isClosed || actionDone) {
    return (
      <div className="rounded-lg border border-teal-500/30 bg-teal-500/10 p-4 text-center">
        <div className="flex items-center justify-center gap-2 text-sm font-semibold text-teal-600 dark:text-teal-400">
          <CheckCircle2 className="h-5 w-5" />
          <span>Incident Status: {actionDone || currentStatus}</span>
        </div>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Action recorded in immutable audit log.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Analyst Decision & Approval Gate
        </h4>
        <span className="text-[11px] text-amber-500 font-medium">Human-in-the-loop Active</span>
      </div>

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Optional SOC analyst notes / rationale before confirming action..."
        rows={2}
        className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
      />

      <div className="flex flex-wrap items-center gap-2 pt-1">
        <button
          onClick={handleApprove}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-teal-600 px-4 py-2 text-xs font-semibold text-white hover:bg-teal-500 active:scale-95 transition-all shadow-sm cursor-pointer"
        >
          <CheckCircle2 className="h-4 w-4" />
          Approve & Contain
        </button>

        <button
          onClick={handleDismiss}
          className="inline-flex items-center justify-center gap-1.5 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all cursor-pointer"
        >
          <XCircle className="h-4 w-4 text-slate-400" />
          Dismiss
        </button>

        <button
          onClick={handleEscalate}
          className="inline-flex items-center justify-center gap-1.5 rounded-md border border-rose-500/30 bg-rose-500/10 px-3.5 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 active:scale-95 transition-all cursor-pointer"
        >
          <AlertOctagon className="h-4 w-4" />
          Escalate
        </button>
      </div>
    </div>
  );
};
