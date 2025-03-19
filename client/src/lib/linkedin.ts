import { apiRequest } from "./queryClient";

export async function fetchLinkedInProfile() {
  const res = await apiRequest("GET", "/api/auth/user");
  return res.json();
}

export async function logout() {
  await apiRequest("POST", "/api/auth/logout");
}
