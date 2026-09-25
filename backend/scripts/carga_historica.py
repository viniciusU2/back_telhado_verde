"""Gera histórico horário fictício de temperatura e umidade.

O script é idempotente para os sensores reservados da carga: executar novamente
não duplica os mesmos horários. Ele não apaga leituras reais existentes.
"""

import argparse
import math
import random
from datetime import datetime, timedelta

from app.db.database import SessionLocal
from app.models.dispositivo import Dispositivo
from app.models.leitura import Leitura


def gerar_valores(horario: datetime, rng: random.Random) -> tuple[float, float]:
    """Produz um ciclo diário plausível, sem pretensão de representar dados reais."""
    hora_decimal = horario.hour + horario.minute / 60
    ciclo = math.sin(2 * math.pi * (hora_decimal - 8) / 24)
    temperatura = round(26 + 5.2 * ciclo + rng.uniform(-0.7, 0.7), 1)
    umidade = round(max(35, min(98, 68 - 20 * ciclo + rng.uniform(-3, 3))), 1)
    return temperatura, umidade


def carregar(device_id: int, dias: int, seed: int, fim: datetime | None = None) -> tuple[int, int]:
    db = SessionLocal()
    try:
        dispositivo = db.query(Dispositivo).filter(Dispositivo.id == device_id).first()
        if not dispositivo:
            raise ValueError(f"Dispositivo {device_id} não encontrado.")

        fim = (fim or datetime.utcnow()).replace(minute=0, second=0, microsecond=0)
        inicio = fim - timedelta(days=dias) + timedelta(hours=1)
        sensor_temperatura = device_id * 1000 + 1
        sensor_umidade = device_id * 1000 + 2
        sensores = (sensor_temperatura, sensor_umidade)

        existentes = {
            (id_sensor, criado_em)
            for id_sensor, criado_em in db.query(Leitura.id_sensor, Leitura.criado_em)
            .filter(
                Leitura.id_dispositivo == device_id,
                Leitura.id_sensor.in_(sensores),
                Leitura.criado_em.between(inicio, fim),
            )
            .all()
        }

        rng = random.Random(seed + device_id)
        novas: list[Leitura] = []
        horario = inicio
        while horario <= fim:
            temperatura, umidade = gerar_valores(horario, rng)
            if (sensor_temperatura, horario) not in existentes:
                novas.append(Leitura(tipo="temperatura", id_sensor=sensor_temperatura, id_dispositivo=device_id, valor=temperatura, criado_em=horario))
            if (sensor_umidade, horario) not in existentes:
                novas.append(Leitura(tipo="umidade", id_sensor=sensor_umidade, id_dispositivo=device_id, valor=umidade, criado_em=horario))
            horario += timedelta(hours=1)

        db.add_all(novas)
        db.commit()
        return len(novas), dias * 24 * 2
    finally:
        db.close()


def main() -> None:
    parser = argparse.ArgumentParser(description="Carga histórica fictícia horária")
    parser.add_argument("--device-id", type=int, default=1, help="ID do dispositivo (padrão: 1)")
    parser.add_argument("--days", type=int, default=30, help="Quantidade de dias (padrão: 30)")
    parser.add_argument("--seed", type=int, default=20260905, help="Semente para reprodução dos valores")
    args = parser.parse_args()
    if not 1 <= args.days <= 365:
        parser.error("--days deve estar entre 1 e 365")
    inseridas, esperadas = carregar(args.device_id, args.days, args.seed)
    print(f"Carga concluída: {inseridas} novas leituras de {esperadas} possíveis.")
    print("Tipos: temperatura e umidade | frequência: 1 hora | dados: FICTÍCIOS")


if __name__ == "__main__":
    main()
