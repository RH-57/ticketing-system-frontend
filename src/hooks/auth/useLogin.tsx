import { useMutation } from '@tanstack/react-query'
import Api from '../../services/api'
import { LoginResponse } from '../../types/auth'

interface LoginRequest {
    identifier: string
    password: string
}

export const useLogin = () => {
    return useMutation<LoginResponse, unknown, LoginRequest>({
        mutationFn: async (data) => {
            const response = await Api.post<LoginResponse>('/api/login', data)

            return response.data
        }
    })
}