import GuestLayout from '@/components/GuestLayout';
import Link from 'next/link';

export default async function ApiDocsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isId = locale === 'id';

  const scopes = [
    { name: 'tasks:read / tasks:write', desc: isId ? 'Membaca dan mengelola tugas Daily Planner & time-blocking.' : 'Read and manage Daily Planner tasks and time blocks.' },
    { name: 'habits:read / habits:write', desc: isId ? 'Mengakses Habit Matrix 28 hari, streak, dan catatan mikro.' : 'Access 28-day Habit Matrix, streaks, rest days, and micro-notes.' },
    { name: 'finance:read / finance:write', desc: isId ? 'Mengelola transaksi, budget envelopes, dan aset multi-mata uang.' : 'Manage zero-based budgets, transactions, and multi-currency assets.' },
    { name: 'goals:read / goals:write', desc: isId ? 'Mengakses target WOOP bertingkat (mingguan hingga tahunan).' : 'Access cascading WOOP goals from weekly to yearly horizons.' },
    { name: 'journals:read / journals:write', desc: isId ? 'Membaca dan menulis jurnal refleksi harian terenkripsi.' : 'Read and create private daily reflection markdown entries.' },
    { name: 'calendar:read / calendar:write', desc: isId ? 'Sinkronisasi jadwal dan tenggat waktu lintas modul.' : 'Synchronize unified calendar schedules and deadlines.' },
  ];

  return (
    <GuestLayout>
      <main className="min-h-screen bg-white dark:bg-slate-950 pt-28 pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
          <header className="space-y-4 border-b border-slate-200 dark:border-slate-800 pb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider">
              OpenAPI 3.1 • OAuth 2.0 PKCE • Agentic Web Standard
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              {isId ? 'Dokumentasi Tranvas API & AI Agent' : 'Tranvas API & AI Agent Documentation'}
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
              {isId
                ? 'Tranvas menyediakan antarmuka REST API terautentikasi dengan isolasi Row Level Security (RLS), metadata OAuth 2.0 standar RFC 8414 & 9728, serta negosiasi konten Markdown asli untuk agen AI.'
                : 'Tranvas provides an authenticated REST API secured by multi-tenant Row Level Security (RLS), RFC 8414 & 9728 OAuth 2.0 metadata, OpenAPI 3.1 schemas, and native Markdown content negotiation for AI agents.'}
            </p>
          </header>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              {isId ? 'Endpoint Discovery Standar Global' : 'Global Standard Discovery Endpoints'}
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: 'OpenAPI 3.1 Specification', href: '/openapi.json', desc: 'Machine-readable REST API & OAuth scopes schema.' },
                { label: 'OAuth 2.0 Protected Resource (RFC 9728)', href: '/.well-known/oauth-protected-resource', desc: 'Declares supported API scopes and bearer methods.' },
                { label: 'OAuth 2.0 Authorization Server (RFC 8414)', href: '/.well-known/oauth-authorization-server', desc: 'PKCE (S256) authorization & token discovery metadata.' },
                { label: 'LLM Context Manifest (llms.txt)', href: '/llms.txt', desc: 'Concise AI agent context & when-to-use guidance.' },
                { label: 'Full LLM Knowledge Base', href: '/llms-full.txt', desc: 'Complete module & AEO reference specification.' },
                { label: 'Open Source Repository (GitHub)', href: 'https://github.com/codesbykhairannoor/oneformind', desc: 'Tranvas codebase, architecture & release history.' },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition bg-slate-50/50 dark:bg-slate-900/50 block"
                >
                  <div className="font-bold text-slate-900 dark:text-white text-sm">{item.label}</div>
                  <div className="font-mono text-xs text-indigo-600 dark:text-indigo-400 mt-1 break-all">{item.href}</div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">{item.desc}</p>
                </a>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              {isId ? 'Daftar Scoped Permissions (OAuth 2.0)' : 'OAuth 2.0 Scoped Permissions'}
            </h2>
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-4 font-bold text-slate-700 dark:text-slate-200">Scope</th>
                    <th className="p-4 font-bold text-slate-700 dark:text-slate-200">Access Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {scopes.map((s) => (
                    <tr key={s.name}>
                      <td className="p-4 font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 whitespace-nowrap">{s.name}</td>
                      <td className="p-4 text-slate-600 dark:text-slate-300">{s.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              {isId ? 'Negosiasi Konten Markdown untuk Agen AI' : 'Markdown Content Negotiation for AI Agents'}
            </h2>
            <pre className="p-5 rounded-2xl bg-slate-900 text-slate-100 text-xs sm:text-sm overflow-x-auto">
              <code>{`curl -sS -H "Accept: text/markdown" https://tranvas.com/`}</code>
            </pre>
            <div className="pt-2">
              <Link href="/resources/guide" className="text-indigo-600 font-bold text-sm hover:underline">
                {isId ? '← Kembali ke Panduan Produk Tranvas' : '← Back to Tranvas Product Guide'}
              </Link>
            </div>
          </section>
        </div>
      </main>
    </GuestLayout>
  );
}
