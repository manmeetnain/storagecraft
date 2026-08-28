import unittest

from storagecraft_tools.raid import calculate_raid


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


if __name__ == "__main__":
    unittest.main()
