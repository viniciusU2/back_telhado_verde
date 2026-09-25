import type { RespostaINMET } from '../types/weather'

export const mockInmetResponse: RespostaINMET = {
  estacao: {
    UF: 'BA',
    CODIGO: 'A424',
    LONGITUDE: '-41.86444444',
    REGIAO: 'NE',
    DISTANCIA_EM_KM: '35',
    NOME: 'IRECÊ',
    LATITUDE: '-11.32888888',
    GEOCODE: '2914604',
  },
  dados: {
    DC_NOME: 'IRECÊ', PRE_INS: '927', TEM_SEN: '25.4', VL_LATITUDE: '-11.32888888', PRE_MAX: '927',
    UF: 'BA', RAD_GLO: '55.5', PTO_INS: '15.9', TEM_MIN: '28.5', VL_LONGITUDE: '-41.86444444',
    UMD_MIN: '38', PTO_MAX: '15.9', VEN_DIR: '93', DT_MEDICAO: '2026-09-04', CHUVA: '0', PRE_MIN: '926.5',
    UMD_MAX: '46', VEN_VEL: '4.1', PTO_MIN: '14.5', TEM_MAX: '30.5', TEN_BAT: '12.7', VEN_RAJ: '7.8',
    TEM_CPU: '32', TEM_INS: '28.5', UMD_INS: '46', CD_ESTACAO: 'A424', HR_MEDICAO: '2100',
  },
}
