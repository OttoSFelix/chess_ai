import unittest
import tempfile
import os
import shutil
from entities.ai_directory import AiDirectory


class TestAiDirectory(unittest.TestCase):

    def setUp(self):
        self.ai_path = tempfile.mkdtemp()
        self.ai_directory = AiDirectory(self.ai_path)

        os.mkdir(os.path.join(self.ai_path, "tiraconfig"))

        with open(
            os.path.join(self.ai_path, "ai_script.py"), "w", encoding="utf-8"
        ) as ai_script:
            ai_script.write("while True:\n  print('log')\n  print(f'MOVE:{input()}')")

        with open(
            os.path.join(self.ai_path, "tiraconfig", "runcommand"),
            "w",
            encoding="utf-8",
        ) as runcommand:
            runcommand.write("python ai_script.py")

    def tearDown(self):
        shutil.rmtree(self.ai_path)

    def test_run_ai_reads_runcommand(self):
        self.ai_directory.run_ai()

        expected_command = ["python", "ai_script.py"]
        self.assertEqual(self.ai_directory.process.args, expected_command)

    def test_run_ai_starts_new_process(self):
        self.ai_directory.run_ai()
        self.assertIsNotNone(self.ai_directory.process)
        self.assertIsNone(self.ai_directory.process.poll())

        self.ai_directory.kill_process()

    def test_kill_process_kills_process(self):
        self.ai_directory.run_ai()
        self.assertIsNone(self.ai_directory.process.poll())
        self.ai_directory.kill_process()
        self.assertIsNotNone(self.ai_directory.process.poll())

    def test_write_and_read_move(self):
        self.ai_directory.run_ai()
        move = "A1"
        self.ai_directory.move(move)
        output, logs = self.ai_directory.play()

        self.assertEqual(output, move)
        self.assertEqual(logs, ["log\n"])

        self.ai_directory.kill_process()
