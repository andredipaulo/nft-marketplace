import { useState } from 'react'
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api/client'
import { useAuthStore } from '@/features/auth/useAuthStore'
import { Loader2, Eye, EyeOff } from 'lucide-react'

export const Route = createFileRoute('/register')({
  component: RegisterPage,
})

function RegisterPage() {
  const navigate = useNavigate()
  const loginStore = useAuthStore((state) => state.login)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')

  const registerMutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/auth/register', { name, email, password })
      return data
    },
    onSuccess: (data) => {
      loginStore(data.user)
      navigate({ to: '/' })
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Erro ao criar conta. Tente novamente.')
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name || !email || !password) return setError('Preencha todos os campos.')
    if (password !== confirmPassword) return setError('As senhas não coincidem.')

    registerMutation.mutate()
  }

  return (
    <div className="min-h-screen bg-ink flex flex-col items-center justify-center p-6 md:p-0">

      <div className="w-full max-w-[400px] flex flex-col items-center">

        {/* Logo */}
        <h1 className="text-3xl font-bold tracking-[0.2em] text-fg mb-12 md:mb-12">KURIO</h1>

        {/* Título */}
        <h2 className="text-xl md:text-2xl font-bold text-fg mb-8 text-center">
          Criar perfil de colecionador
        </h2>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">

          <input
            type="text"
            placeholder="Nome de usuário"
            value={name} onChange={e => setName(e.target.value)}
            className="w-full bg-transparent border border-border p-4 rounded-xl text-fg focus:border-primary outline-none placeholder-fg-secondary"
          />

          <input
            type="email"
            placeholder="Digite seu e-mail"
            value={email} onChange={e => setEmail(e.target.value)}
            className="w-full bg-transparent border border-border p-4 rounded-xl text-fg focus:border-primary outline-none placeholder-fg-secondary"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              value={password} onChange={e => setPassword(e.target.value)}
              className="w-full bg-transparent border border-border p-4 rounded-xl text-fg focus:border-primary outline-none placeholder-fg-secondary"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-fg-secondary hover:text-fg"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirmar senha"
              value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
              className="w-full bg-transparent border border-border p-4 rounded-xl text-fg focus:border-primary outline-none placeholder-fg-secondary"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-fg-secondary hover:text-fg"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full bg-primary text-ink font-bold text-lg py-4 rounded-xl hover:bg-primary-accent transition mt-4 flex justify-center items-center gap-2"
          >
            {registerMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Criar perfil'}
          </button>
        </form>

        {/* Separador */}
        <div className="w-full flex items-center gap-4 mt-8 mb-6">
          <div className="h-px bg-border flex-1"></div>
          <span className="text-xs text-fg-secondary">Ou continue com</span>
          <div className="h-px bg-border flex-1"></div>
        </div>

        {/* Botões Sociais */}
        <div className="w-full flex flex-col gap-3">
          <button type="button" className="flex items-center justify-center gap-3 w-full border border-border p-3.5 rounded-xl hover:bg-surface-card transition">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            <span className="text-fg text-sm font-medium">Continuar com Google</span>
          </button>
          <button type="button" className="flex items-center justify-center gap-3 w-full border border-border p-3.5 rounded-xl hover:bg-surface-card transition">
            <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook" className="w-5 h-5" />
            <span className="text-fg text-sm font-medium">Continuar com Facebook</span>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-sm text-fg-secondary">
          Já tem uma conta?{' '}
          <Link to="/login" className="text-fg font-medium hover:underline">
            Entre
          </Link>
        </div>

      </div>
    </div>
  )
}