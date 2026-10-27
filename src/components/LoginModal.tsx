import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api/client'
import { useAuthStore } from '@/features/auth/useAuthStore'
import { Loader2, X, Eye, EyeOff } from 'lucide-react'

export function LoginModal({ onClose }: { onClose: () => void }) {
  const loginStore = useAuthStore((state) => state.login)

  const [isRegister, setIsRegister] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const authMutation = useMutation({
    mutationFn: async () => {
      const url = isRegister ? '/auth/register' : '/auth/login'
      const payload = isRegister ? { name, email, password } : { email, password }
      const { data } = await api.post(url, payload)
      return data
    },
    onSuccess: (data) => {
      loginStore(data.user)
      onClose()
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Erro ao autenticar. Verifique seus dados.')
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) return setError('Preencha e-mail e senha.')

    if (isRegister) {
      if (!name) return setError('Preencha seu nome de usuário.')
      if (password !== confirmPassword) return setError('As senhas não coincidem.')
    }

    authMutation.mutate()
  }

  return (
    <div className="fixed inset-0 bg-ink/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-[420px] bg-surface-card p-8 rounded-xl border border-border relative shadow-2xl">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-fg-secondary hover:text-fg transition"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Abas */}
        <div className="flex justify-center gap-6 mb-6 border-b border-border">
          <button
            onClick={() => { setIsRegister(false); setError(''); }}
            className={`text-lg font-bold pb-3 ${!isRegister ? 'text-primary-accent border-b-2 border-primary' : 'text-fg-secondary hover:text-fg'}`}
          >
            Entrar
          </button>
          <button
            onClick={() => { setIsRegister(true); setError(''); }}
            className={`text-lg font-bold pb-3 ${isRegister ? 'text-primary-accent border-b-2 border-primary' : 'text-fg-secondary hover:text-fg'}`}
          >
            Criar conta
          </button>
        </div>

        <p className="text-sm text-center text-fg-secondary mb-6">
          {isRegister
            ? 'Crie seu perfil de colecionador e conecte uma carteira quando quiser.'
            : 'Entre para gerenciar sua carteira, coleção e perfil de criador.'}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {isRegister && (
            <input
              type="text"
              placeholder="Nome de usuário"
              value={name} onChange={e => setName(e.target.value)}
              className="w-full bg-ink border border-border p-3 rounded text-fg focus:border-primary outline-none"
            />
          )}

          <input
            type="email"
            placeholder="Digite seu e-mail"
            value={email} onChange={e => setEmail(e.target.value)}
            className="w-full bg-ink border border-border p-3 rounded text-fg focus:border-primary outline-none"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              value={password} onChange={e => setPassword(e.target.value)}
              className="w-full bg-ink border border-border p-3 rounded text-fg focus:border-primary outline-none pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-fg-secondary hover:text-fg"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {isRegister && (
            <input
              type="password"
              placeholder="Confirmar senha"
              value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
              className="w-full bg-ink border border-border p-3 rounded text-fg focus:border-primary outline-none"
            />
          )}

          {!isRegister && (
            <div className="text-right">
              <a href="#" className="text-xs text-primary-accent hover:underline">Esqueceu a senha?</a>
            </div>
          )}

          {error && <p className="text-red-500 text-sm text-center bg-red-500/10 p-2 rounded">{error}</p>}

          <button
            type="submit"
            disabled={authMutation.isPending}
            className="w-full bg-primary text-ink font-bold py-3 rounded hover:bg-primary-accent transition mt-2 flex justify-center items-center gap-2"
          >
            {authMutation.isPending
              ? <Loader2 className="w-5 h-5 animate-spin" />
              : (isRegister ? 'Criar conta' : 'Entrar')}
          </button>
        </form>

        <div className="mt-6 flex items-center gap-4">
          <div className="h-px bg-border flex-1"></div>
          <span className="text-xs text-fg-secondary uppercase tracking-wider">Ou continue com</span>
          <div className="h-px bg-border flex-1"></div>
        </div>

        <div className="flex flex-col gap-3 mt-4">
          <button type="button" className="flex items-center justify-center gap-2 w-full border border-border p-3 rounded hover:bg-surface-dark transition text-sm">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" /> Continuar com Google
          </button>
          <button type="button" className="flex items-center justify-center gap-2 w-full border border-border p-3 rounded hover:bg-surface-dark transition text-sm">
            <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook" className="w-4 h-4" /> Continuar com Facebook
          </button>
        </div>

      </div>
    </div>
  )
}