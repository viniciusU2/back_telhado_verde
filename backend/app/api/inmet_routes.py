import json
import os
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from fastapi import APIRouter, HTTPException, Path, status


router = APIRouter(prefix="/inmet", tags=["INMET"])
INMET_API_URL = os.getenv(
    "INMET_API_URL", "https://apiprevmet3.inmet.gov.br/estacao/proxima"
).rstrip("/")


@router.get("/proxima/{codigo_ibge}")
def obter_estacao_proxima(
    codigo_ibge: str = Path(pattern=r"^\d{7}$", description="Código IBGE com 7 dígitos"),
):
    """Proxy mínimo para a API pública do INMET, que não permite CORS."""
    request = Request(
        f"{INMET_API_URL}/{codigo_ibge}",
        headers={"Accept": "application/json", "User-Agent": "TelhadoVerde/1.0"},
    )
    try:
        with urlopen(request, timeout=20) as response:
            payload = json.loads(response.read().decode("utf-8"))
    except HTTPError as error:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=f"INMET respondeu com status {error.code}.") from error
    except (URLError, TimeoutError) as error:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Não foi possível conectar à API do INMET.") from error
    except (UnicodeDecodeError, json.JSONDecodeError) as error:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="A API do INMET retornou uma resposta inválida.") from error

    if not isinstance(payload, dict) or not isinstance(payload.get("estacao"), dict) or not isinstance(payload.get("dados"), (dict, list)):
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="O contrato retornado pela API do INMET é incompatível.")
    return payload
