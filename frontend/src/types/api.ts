export interface ApiDispositivo {
  id: number
  nome: string
  latitude: number
  longitude: number
  criado_em?: string
}

export interface DispositivoInput {
  nome: string
  latitude: number
  longitude: number
}

export interface ApiLeitura {
  id: number
  criado_em: string
  tipo: string
  id_sensor: number
  id_dispositivo: number
  valor: number
}

export interface ApiListaLeituras {
  total: number
  dados: ApiLeitura[]
}
