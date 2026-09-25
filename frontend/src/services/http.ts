export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(url, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...init?.headers },
    })
  } catch {
    throw new ApiError('Não foi possível conectar à API. Confirme se o servidor está disponível.')
  }

  if (!response.ok) {
    let detail = ''
    try {
      const body = (await response.json()) as { detail?: string }
      detail = body.detail ? `: ${body.detail}` : ''
    } catch {
      // Resposta sem JSON.
    }
    throw new ApiError(`A API respondeu com erro ${response.status}${detail}`, response.status)
  }

  try {
    return (await response.json()) as T
  } catch {
    throw new ApiError('A API retornou uma resposta que não é JSON válido.', response.status)
  }
}
