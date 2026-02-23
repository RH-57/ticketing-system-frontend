export interface LoginResponse {
    success: boolean
    message: string
    data: {
        id: number
        name: string
        username: string
        email: string
        role: string
        status: string
        created_at: string
        updated_at: string
        token: string
    }
}