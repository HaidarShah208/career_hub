import http, { unwrap } from '@/shared/services/http'

export async function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<{ message: string }> {
  const res = await http.patch('/users/me/password', { currentPassword, newPassword })
  return unwrap(res)
}
