import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'
import Spline from '@splinetool/react-spline'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Hero() {
  return (
    <div className="relative min-h-[70vh] overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/41MGRk-UDPKO-l6W/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="relative z-10 px-6 pt-24 pb-12 max-w-5xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg">Fintech Billing for Angola</h1>
        <p className="mt-4 text-blue-100 max-w-2xl mx-auto">Assine, facture e cresça. Planos com limites claros para monetização desde o primeiro dia.</p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <a href="#auth" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold transition">Começar</a>
          <a href="#plans" className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-semibold transition">Ver Planos</a>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-900/30 via-slate-900/60 to-slate-900"></div>
    </div>
  )
}

function AuthSection() {
  const [mode, setMode] = useState('login')
  return (
    <div id="auth" className="max-w-5xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-8">
      <div>
        <h2 className="text-2xl text-white font-bold mb-4">Autenticação</h2>
        <p className="text-blue-200/80">Crie a sua conta e escolha um plano ou entre para continuar.</p>
        <div className="mt-6 inline-flex rounded-lg bg-slate-800/60 p-1">
          <button onClick={() => setMode('login')} className={`px-4 py-2 rounded-md text-sm font-semibold ${mode==='login'?'bg-blue-600 text-white':'text-blue-200'}`}>Entrar</button>
          <button onClick={() => setMode('register')} className={`px-4 py-2 rounded-md text-sm font-semibold ${mode==='register'?'bg-blue-600 text-white':'text-blue-200'}`}>Criar Conta</button>
        </div>
        {mode === 'login' ? <LoginForm /> : <RegisterForm />}
      </div>
      <div>
        <PlansCard />
      </div>
    </div>
  )
}

function LoginForm() {
  const nav = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await fetch(`${API_BASE}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(form) })
      if (!res.ok) throw new Error('Credenciais inválidas')
      nav('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally { setLoading(false) }
  }

  return (
    <form onSubmit={submit} className="mt-6 bg-slate-800/60 border border-white/10 rounded-2xl p-6 space-y-4">
      <div>
        <label className="block text-sm text-blue-200 mb-1">Email</label>
        <input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="w-full bg-slate-900/60 border border-white/10 rounded-lg px-3 py-2 text-white" />
      </div>
      <div>
        <label className="block text-sm text-blue-200 mb-1">Palavra-passe</label>
        <input type="password" required value={form.password} onChange={e=>setForm({...form,password:e.target.value})} className="w-full bg-slate-900/60 border border-white/10 rounded-lg px-3 py-2 text-white" />
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button disabled={loading} className="w-full bg-blue-600 disabled:opacity-60 hover:bg-blue-500 text-white py-2 rounded-lg font-semibold">{loading? 'A entrar...' : 'Entrar'}</button>
      <a href="#" className="text-blue-300 text-sm">Recuperar palavra-passe</a>
    </form>
  )
}

function RegisterForm() {
  const nav = useNavigate()
  const [form, setForm] = useState({ name:'', email: '', password: '', plan:'basic' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await fetch(`${API_BASE}/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(form) })
      if (!res.ok) {
        const t = await res.text(); throw new Error(t || 'Erro ao registar')
      }
      nav('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally { setLoading(false) }
  }

  return (
    <form onSubmit={submit} className="mt-6 bg-slate-800/60 border border-white/10 rounded-2xl p-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-blue-200 mb-1">Nome</label>
          <input type="text" required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full bg-slate-900/60 border border-white/10 rounded-lg px-3 py-2 text-white" />
        </div>
        <div>
          <label className="block text-sm text-blue-200 mb-1">Email</label>
          <input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="w-full bg-slate-900/60 border border-white/10 rounded-lg px-3 py-2 text-white" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-blue-200 mb-1">Palavra-passe</label>
          <input type="password" required value={form.password} onChange={e=>setForm({...form,password:e.target.value})} className="w-full bg-slate-900/60 border border-white/10 rounded-lg px-3 py-2 text-white" />
        </div>
        <div>
          <label className="block text-sm text-blue-200 mb-1">Plano</label>
          <select value={form.plan} onChange={e=>setForm({...form, plan:e.target.value})} className="w-full bg-slate-900/60 border border-white/10 rounded-lg px-3 py-2 text-white">
            <option value="basic">BASIC</option>
            <option value="professional">PROFESSIONAL</option>
            <option value="enterprise">ENTERPRISE</option>
          </select>
        </div>
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button disabled={loading} className="w-full bg-blue-600 disabled:opacity-60 hover:bg-blue-500 text-white py-2 rounded-lg font-semibold">{loading? 'A criar...' : 'Criar Conta'}</button>
    </form>
  )
}

function PlansCard() {
  const plans = [
    { key:'basic', title:'BASIC', price:'5,000 Kz/mês', features:['15 clientes','20 facturas/mês','Clientes + Facturação Básica','Suporte por Email']},
    { key:'professional', title:'PROFESSIONAL', price:'15,000 Kz/mês', features:['50 clientes','Facturas ilimitadas','Módulos completos (sem API)','Relatórios','Email + Chat']},
    { key:'enterprise', title:'ENTERPRISE', price:'35,000 Kz/mês', features:['Clientes ilimitados','Todos módulos + API','Vários utilizadores','Onboarding personalizado']},
  ]
  return (
    <div id="plans" className="grid gap-4">
      {plans.map(p => (
        <div key={p.key} className="bg-slate-800/60 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-bold text-lg">{p.title}</h3>
              <p className="text-blue-200">{p.price}</p>
            </div>
          </div>
          <ul className="mt-4 space-y-2 text-blue-100 text-sm list-disc list-inside">
            {p.features.map((f,i)=>(<li key={i}>{f}</li>))}
          </ul>
        </div>
      ))}
    </div>
  )
}

function Dashboard() {
  const nav = useNavigate()
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchSummary() }, [])

  async function fetchSummary() {
    setLoading(true)
    const res = await fetch(`${API_BASE}/dashboard/summary`, { credentials:'include' })
    if (res.status === 401) { nav('/'); return }
    const data = await res.json(); setSummary(data); setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="px-6 py-4 flex items-center justify-between border-b border-white/10">
        <h1 className="font-bold">Painel</h1>
        <div className="flex items-center gap-3">
          <span className="text-blue-200 text-sm">Plano: {summary?.plan?.toUpperCase()}</span>
          <a href="/settings" className="text-sm underline">Definições</a>
        </div>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/60 border border-white/10 rounded-xl p-4">
          <p className="text-blue-300 text-sm">Clientes</p>
          <p className="text-3xl font-bold">{summary?.clients_count ?? '-'}</p>
          {summary?.warnings?.clients && <p className="mt-2 text-amber-300 text-sm">A aproximar-se do limite do plano (80%).</p>}
        </div>
        <div className="bg-slate-800/60 border border-white/10 rounded-xl p-4">
          <p className="text-blue-300 text-sm">Facturas este mês</p>
          <p className="text-3xl font-bold">{summary?.invoices_this_month ?? '-'}</p>
          {summary?.warnings?.invoices && <p className="mt-2 text-amber-300 text-sm">A aproximar-se do limite do plano (80%).</p>}
        </div>
        <div className="bg-slate-800/60 border border-white/10 rounded-xl p-4">
          <p className="text-blue-300 text-sm">Ações rápidas</p>
          <div className="mt-2 flex gap-2">
            <a href="/clients" className="px-3 py-2 bg-blue-600 rounded-lg text-sm">Adicionar Cliente</a>
            <a href="/invoices/new" className="px-3 py-2 bg-white/10 rounded-lg text-sm">Nova Factura</a>
          </div>
        </div>
      </div>
    </div>
  )
}

function AppShell() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950">
      <Hero />
      <AuthSection />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppShell />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
