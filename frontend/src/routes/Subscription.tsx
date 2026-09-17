import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Shield,
  Check,
  Zap,
  Sparkles,
  Building,
  HelpCircle,
  CreditCard,
  Download,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { RadialGlowButton } from '../components/shared/RadialGlowButton';
import { StaggerText } from '../components/ui/staggerText';

interface SubscriptionProps {
  onNavigate: (route: string) => void;
}

export const Subscription: React.FC<SubscriptionProps> = ({ onNavigate }) => {
  const { user, setPlan } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [upgradeSuccess, setUpgradeSuccess] = useState<string | null>(null);

  const currentPlan = user?.plan || 'SOC Pro';

  const handleSelectPlan = (planName: 'Community' | 'SOC Pro' | 'Enterprise') => {
    setPlan(planName);
    setUpgradeSuccess(`Successfully transitioned operator tier to ${planName}!`);
    setTimeout(() => setUpgradeSuccess(null), 4000);
  };

  const plans = [
    {
      id: 'Community' as const,
      name: 'Community Analyst',
      description: 'Ideal for independent security researchers, bug hunters, and trial investigation.',
      priceMonthly: 0,
      priceAnnual: 0,
      badge: 'Free Tier',
      highlight: false,
      features: [
        '100 URL & Phishing scans per day',
        'Basic PhishMind v2 Lexical heuristics',
        'Community MITRE ATT&CK mapping',
        'Standard single-seat web console',
        'Community threat feeds'
      ],
      unavailable: [
        'Deepfake video & voice clone inference',
        'Account Takeover (ATO) isolation forests',
        'Automated containment playbooks',
        'Dedicated SIEM webhooks (Splunk/Sentinel)',
        '24/7 Priority SLA response'
      ]
    },
    {
      id: 'SOC Pro' as const,
      name: 'SOC Pro Tier',
      description: 'Built for frontline SOC teams, threat hunters, and Incident Response investigators.',
      priceMonthly: 49,
      priceAnnual: 39,
      badge: 'Most Popular',
      highlight: true,
      features: [
        '5,000 URL & Phishing scans per day',
        'Real-time Deepfake & Synthetic Media neural engine',
        'Cloned voice waveform & vocoder analysis',
        'Account Takeover & Impossible Travel detection',
        'Explainable AI (XAI) feature attribution breakdown',
        '1-Click Automated Containment & Human Approval gates',
        'Live SOC dashboard with incident timeline',
        'Standard API token access'
      ],
      unavailable: [
        'Dedicated isolated private VPC cluster',
        'Custom neural weight fine-tuning'
      ]
    },
    {
      id: 'Enterprise' as const,
      name: 'Enterprise Grid',
      description: 'Full-spectrum cyber defense for large SOC operations, MSSPs, and government teams.',
      priceMonthly: 249,
      priceAnnual: 199,
      badge: 'Maximum Defense',
      highlight: false,
      features: [
        'Unlimited URL, Phishing & Deepfake scans',
        'Multi-tenant SOC Lead approval pipelines',
        'Live SIEM & SOAR streaming (Splunk, Microsoft Sentinel)',
        'Dedicated isolated on-prem / VPC neural node',
        'Custom corporate brand impersonation scrapers',
        'Custom fine-tuned PhishMind & audio classifiers',
        'Immutable SOC forensic audit ledger',
        '24/7 Dedicated Security Architect SLA'
      ],
      unavailable: []
    }
  ];

  const comparisonRows = [
    { feature: 'Daily URL Scan Limit', community: '100 / day', pro: '5,000 / day', enterprise: 'Unlimited' },
    { feature: 'Deepfake & Synthetic Media Scans', community: '—', pro: '100 / day', enterprise: 'Unlimited' },
    { feature: 'Cloned Voice Audio Detection', community: '—', pro: 'Included (Neural Vocoder)', enterprise: 'Included (Multi-modal)' },
    { feature: 'ATO Anomaly & Impossible Travel', community: '—', pro: 'Included (Isolation Forest)', enterprise: 'Included (Real-time Stream)' },
    { feature: 'Explainable AI (XAI) Attribution', community: 'Basic score', pro: 'Full SHAP / Factor weights', enterprise: 'Deep forensic breakdown' },
    { feature: 'Human Approval Containment Gate', community: 'Manual', pro: '1-Click Guided Triage', enterprise: 'Automated + Lead Sign-off' },
    { feature: 'SIEM / SOAR API Integrations', community: '—', pro: 'REST API & Webhooks', enterprise: 'Splunk, Sentinel, QRadar' },
    { feature: 'Dedicated Private Node Deployment', community: '—', pro: '—', enterprise: 'On-prem / Cloud VPC' },
    { feature: 'Enterprise SLA & Support', community: 'Community Discord', pro: '99.9% / 8hr ticket SLA', enterprise: '99.99% / 15min 24/7 pager' }
  ];

  const invoices = [
    { id: 'INV-2026-0901', date: 'Sep 01, 2026', amount: '$39.00', plan: 'SOC Pro (Annual)', status: 'Paid' },
    { id: 'INV-2026-0801', date: 'Aug 01, 2026', amount: '$39.00', plan: 'SOC Pro (Annual)', status: 'Paid' },
    { id: 'INV-2026-0701', date: 'Jul 01, 2026', amount: '$39.00', plan: 'SOC Pro (Annual)', status: 'Paid' }
  ];

  const faqs = [
    {
      q: 'Can we deploy CyberGuard models completely on-premise?',
      a: 'Yes. The Enterprise Grid tier supports deployment on your isolated VPC, Kubernetes clusters, or air-gapped on-premise servers with local model inference.'
    },
    {
      q: 'How does the human approval containment gate work?',
      a: 'CyberGuard never applies critical network isolates without operator confirmation. Recommended playbooks are generated with confidence scores, waiting for a single click from an authorized SOC Analyst or SOC Lead.'
    },
    {
      q: 'What happens if we exceed our daily scan quota?',
      a: 'Standard scans are queued with rate limiting. High-priority SOC alerts will continue to be evaluated with threat intel fallback mode without interruption.'
    },
    {
      q: 'Is our corporate telemetry encrypted and kept private?',
      a: 'All submitted URLs, media samples, and identity telemetry are encrypted at rest with AES-256 and in transit with TLS 1.3. We adhere strictly to zero-retention policies for confidential enterprise media.'
    }
  ];

  return (
    <div className="py-8 space-y-12 max-w-6xl mx-auto">
      {/* HEADER HERO */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          <StaggerText divideBy="word" delay={0.1}>
            Enterprise Security Capacity & AI Telemetry Plans
          </StaggerText>
        </h1>

        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Scale your Threat Intelligence operations from individual triage to full-scale autonomous AI containment grids.
        </p>

        {/* BILLING CYCLE TOGGLE */}
        <div className="pt-2 flex items-center justify-center">
          <div className="inline-flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 p-1">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                billingCycle === 'annual'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-400 text-slate-900 font-bold">
                Save 20%
              </span>
            </button>
          </div>
        </div>
      </div>

      {upgradeSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>{upgradeSuccess}</span>
          </div>
          <button
            onClick={() => onNavigate('profile')}
            className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>View updated quota in profile</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* PRICING CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrent = currentPlan === plan.id;
          const price = billingCycle === 'annual' ? plan.priceAnnual : plan.priceMonthly;

          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl border p-6 flex flex-col justify-between transition-all ${
                plan.highlight
                  ? 'border-teal-500/60 bg-gradient-to-b from-teal-500/5 via-slate-50 dark:via-slate-900 to-white dark:to-slate-950 shadow-xl shadow-teal-500/10'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 px-3 py-0.5 text-[11px] font-bold text-white shadow-sm uppercase tracking-wider">
                  {plan.badge}
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {plan.name}
                  </h3>
                  {!plan.highlight && (
                    <span className="text-[11px] font-mono text-slate-400 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                      {plan.badge}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 min-h-[36px]">
                  {plan.description}
                </p>

                <div className="flex items-baseline gap-1 pt-2">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                    ${price}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {plan.id === 'Community' ? 'forever' : '/analyst/month'}
                  </span>
                </div>

                {billingCycle === 'annual' && plan.priceMonthly > 0 && (
                  <div className="text-[11px] text-teal-600 dark:text-teal-400 font-medium">
                    Billed annually (${plan.priceAnnual * 12}/yr)
                  </div>
                )}

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2.5">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    What's included
                  </span>
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                      <Check className="h-4 w-4 text-teal-500 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}

                  {plan.unavailable.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-400 dark:text-slate-600 line-through opacity-70">
                      <span className="h-4 w-4 text-center shrink-0">—</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                {isCurrent ? (
                  <button
                    disabled
                    className="w-full py-2.5 rounded-lg border border-teal-500/40 bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-bold text-center cursor-default"
                  >
                    Current Active Plan
                  </button>
                ) : plan.highlight ? (
                  <RadialGlowButton
                    variant="glow"
                    onClick={() => handleSelectPlan(plan.id)}
                    className="w-full py-2.5 text-xs font-semibold"
                  >
                    <span>Upgrade to {plan.name}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </RadialGlowButton>
                ) : (
                  <button
                    onClick={() => handleSelectPlan(plan.id)}
                    className="w-full py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer"
                  >
                    Select {plan.name}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* FULL FEATURE COMPARISON TABLE */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="h-4 w-4 text-teal-500" />
          Comprehensive Capability Matrix
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                <th className="py-3 px-4 font-semibold">Capability / Telemetry Engine</th>
                <th className="py-3 px-4 font-semibold">Community</th>
                <th className="py-3 px-4 font-semibold text-teal-600 dark:text-teal-400">SOC Pro</th>
                <th className="py-3 px-4 font-semibold">Enterprise Grid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {comparisonRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-medium text-slate-900 dark:text-slate-200">
                    {row.feature}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-mono">
                    {row.community}
                  </td>
                  <td className="py-3 px-4 text-teal-700 dark:text-teal-300 font-semibold font-mono">
                    {row.pro}
                  </td>
                  <td className="py-3 px-4 text-slate-900 dark:text-slate-100 font-semibold font-mono">
                    {row.enterprise}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* BILLING HISTORY & INVOICING */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-amber-500" />
              Invoices & Billing History
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Download tax invoices and transaction receipts for corporate accounting.
            </p>
          </div>
          <button
            onClick={() => onNavigate('profile')}
            className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
          >
            Operator Profile →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400">
                <th className="py-2.5 px-3 font-semibold">Invoice Ref</th>
                <th className="py-2.5 px-3 font-semibold">Billing Date</th>
                <th className="py-2.5 px-3 font-semibold">Tier Plan</th>
                <th className="py-2.5 px-3 font-semibold">Amount</th>
                <th className="py-2.5 px-3 font-semibold">Status</th>
                <th className="py-2.5 px-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td className="py-2.5 px-3 font-mono font-medium text-slate-900 dark:text-slate-200">
                    {inv.id}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                    {inv.date}
                  </td>
                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">
                    {inv.plan}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-semibold text-slate-900 dark:text-white">
                    {inv.amount}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-3 w-3" />
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => alert(`Downloading ${inv.id}.pdf receipt...`)}
                      className="inline-flex items-center gap-1 text-[11px] text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
                    >
                      <Download className="h-3 w-3" />
                      <span>PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQS & SECURITY COMPLIANCE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Building className="h-4 w-4 text-teal-500" />
            SOC Standards & Trust
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            CyberGuard architecture conforms to stringent enterprise compliance frameworks.
          </p>

          <div className="space-y-2 pt-2 text-xs">
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <Shield className="h-4 w-4 text-teal-500" />
              <div>
                <div className="font-semibold text-slate-900 dark:text-slate-100">SOC 2 Type II Certified</div>
                <div className="text-[10px] text-slate-400">Continuous third-party security audits</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <Shield className="h-4 w-4 text-teal-500" />
              <div>
                <div className="font-semibold text-slate-900 dark:text-slate-100">ISO 27001 & GDPR Compliant</div>
                <div className="text-[10px] text-slate-400">Zero data retention on raw customer media</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <Shield className="h-4 w-4 text-teal-500" />
              <div>
                <div className="font-semibold text-slate-900 dark:text-slate-100">MITRE ATT&CK Matrix v14</div>
                <div className="text-[10px] text-slate-400">Full tactic & technique taxonomy coverage</div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-purple-400" />
            Frequently Asked Questions
          </h3>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 space-y-1"
              >
                <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  {faq.q}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {faq.a}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
