type ApiResponse<T> = { success: true; data: T } | { success: false; error: { message: string } };

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(path, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...init?.headers },
    });
  } catch {
    throw new Error('Could not reach the server. Check your connection and try again.');
  }
  const payload = await response.json() as ApiResponse<T>;
  if (!response.ok || !payload.success) {
    throw new Error(payload.success ? 'The request could not be completed.' : payload.error.message);
  }
  return payload.data;
}
