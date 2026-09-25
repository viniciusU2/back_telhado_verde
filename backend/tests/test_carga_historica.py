import random
import unittest
from datetime import datetime

from scripts.carga_historica import gerar_valores


class CargaHistoricaTest(unittest.TestCase):
    def test_valores_ficam_em_faixas_plausiveis(self):
        rng = random.Random(42)
        for hora in range(24):
            temperatura, umidade = gerar_valores(datetime(2026, 9, 1, hora), rng)
            self.assertGreaterEqual(temperatura, 15)
            self.assertLessEqual(temperatura, 40)
            self.assertGreaterEqual(umidade, 0)
            self.assertLessEqual(umidade, 100)

    def test_mesma_semente_reproduz_resultado(self):
        horario = datetime(2026, 9, 1, 12)
        self.assertEqual(gerar_valores(horario, random.Random(10)), gerar_valores(horario, random.Random(10)))


if __name__ == "__main__":
    unittest.main()
