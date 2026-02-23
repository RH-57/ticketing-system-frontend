import { useMutation } from "@tanstack/react-query";
import Api from "../../services/api";
import Cookies from "js-cookie";
import { AxiosError } from "axios";

interface UserRequest {
  name: string
  username: string
  email: string
  password: string
  role: string
}

interface ApiErrorResponse {
  errors: Record<string, string>
}

const useUserCreate = () => {
  return useMutation<
    unknown,
    AxiosError<ApiErrorResponse>,
    UserRequest
  >({
    mutationFn: async (data: UserRequest) => {
      const token = Cookies.get('token')

      const response = await Api.post('/api/users', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      return response.data
    }
  })
}

export default useUserCreate