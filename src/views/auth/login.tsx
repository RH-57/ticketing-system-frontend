import { FC, useState, useContext, FormEvent, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useLogin } from '../../hooks/auth/useLogin'
import Cookies from 'js-cookie'
import { AuthContext } from '../../context/AuthContext'
import { LoginResponse } from '../../types/auth'
import { AxiosError } from 'axios'

interface ValidationErrors {
    [key: string]: string
}

interface ErrorResponse {
  success: boolean
  message: string
  errors?: ValidationErrors
}

export const Login: FC = () => {
    const navigate = useNavigate()
    const {mutate, isPending} = useLogin()
    const {setIsAuthenticated} = useContext(AuthContext)!

    const [identifier, setIdentifier] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [errors, setErrors] = useState<ValidationErrors>({})

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault()

        mutate({
            identifier,
            password
        }, {
            onSuccess: (data: LoginResponse) => {
                Cookies.set('token', data.data.token)
                
                Cookies.set('user', JSON.stringify({
                    id: data.data.id,
                    name: data.data.name,
                    username: data.data.username,
                    email: data.data.email
                }))

                setIsAuthenticated(true)
                
                navigate('/dashboard')
            },
            onError: (error) => {
            const err = error as AxiosError<ErrorResponse>

                if (err.response?.data?.errors && Object.keys(err.response.data.errors).length > 0) {
                    setErrors(err.response.data.errors)
                } else if (err.response?.data?.message) {
                    setErrors({ general: err.response.data.message })
                } else {
                    setErrors({ general: 'Login Failed, please try again' })
                }
            }
        })
    }

    useEffect(() => {
        document.title = "Login - Ticketing System"
    })
    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden
                bg-gray-50 dark:bg-black transition-colors duration-300">

        {/* background */}
        <div className="absolute inset-0 pointer-events-none
            bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)]
            bg-[size:40px_40px] 
            dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)]
        "></div>

        <div className="absolute top-20 left-10 w-60 h-60 bg-red-500/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-500/20 blur-[140px] rounded-full"></div>

        <div className="w-full max-w-md relative z-10
                        bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl
                        border border-gray-200 dark:border-gray-600
                        shadow-2xl rounded-2xl p-8">

            <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-2">
                IT Ticketing System
            </h1>

            <p className="text-center text-gray-500 dark:text-gray-400 mb-6">
                Login to your account
            </p>

            {errors.general && (
            <div className="mb-4 text-sm text-red-600 text-center">
                {errors.general}
            </div>
            )}

            <form onSubmit={handleLogin}>
                <div className="mb-4">
                    <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
                        Email or Username
                    </label>
                    <input
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                            bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100
                            focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    type="text"
                    placeholder="Your Email"
                    required
                    />
                    {errors.identifier && (
                        <p className="text-sm text-red-500 mt-1">{errors.identifier}</p>
                    )}
                </div>

                <div className="mb-6">
                    <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
                    Password
                    </label>
                    <input
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                            bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100
                            focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="Your Password"
                    required
                    />
                    {errors.password && (
                        <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full py-2 text-white font-semibold rounded-lg
                            bg-yellow-600 hover:bg-yellow-700
                            disabled:bg-gray-400 disabled:cursor-not-allowed
                            transition-all duration-200"
                >
                    {isPending ? 'Logging in...' : 'Login'}
                </button>
            </form>

            <p className="text-center text-gray-500 dark:text-gray-400 mt-8 text-sm">
            © 2026 • Ticketing System
            </p>
        </div>
        </div>
    )
}

export default Login