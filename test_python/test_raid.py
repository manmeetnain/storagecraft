import unittest

from storagecraft_tools import erasure_coding, gpu_memory, nvme_queues, rag_storage
from storagecraft_tools.raid import SPECS, calculate_raid, compare_raids


class RaidTests(unittest.TestCase):
    def test_raid6_capacity(self):
        result = calculate_raid("raid6", 8, 4)
        self.assertEqual(result.usable_tb, 24)
        self.assertEqual(result.max_failures, 2)
        self.assertEqual(result.efficiency, 0.75)

    def test_raid10_requires_even_count(self):
        with self.assertRaisesRegex(ValueError, "even"):
            calculate_raid("10", 5, 4)

    def test_rejects_unsupported_level(self):
        with self.assertRaisesRegex(ValueError, "one of"):
            calculate_raid("7", 8, 4)

    def test_every_raid_family_returns_or_explains_invalid_layout(self):
        comparison = compare_raids(16, 4, groups=2)
        self.assertEqual(len(comparison), len(SPECS))
        self.assertTrue(all("usable_tb" in item or "error" in item for item in comparison))

    def test_nested_and_raid_z_capacity(self):
        self.assertEqual(calculate_raid("60", 16, 4, groups=2).usable_tb, 48)
        self.assertEqual(calculate_raid("z3", 8, 4).usable_tb, 20)

    def test_additional_engineering_models(self):
        self.assertTrue(erasure_coding(10, 4, 100, 2)["recoverable"])
        self.assertEqual(nvme_queues(8, 32, 100, 1_000_000, 800_000)["limiting_factor"], "host stack")
        self.assertGreater(rag_storage(1_000_000, 1200, 512)["chunks"], 1_000_000)
        self.assertIn("fits", gpu_memory(70, 4, 80, 8, 128, 8192, 8))


if __name__ == "__main__":
    unittest.main()
