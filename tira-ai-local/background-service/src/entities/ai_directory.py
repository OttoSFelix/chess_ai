# pylint: disable=consider-using-with
import subprocess
from os import path


class AiDirectory:
    """Represents a directory containing AI scripts.

    Args:
        ai_path (str): The path to the directory containing AI scripts.

    Attributes:
        ai_path (str): The path to the directory containing AI scripts.
        process (subprocess.Popen | None): The subprocess representing the AI process, or None if not running.
    """

    def __init__(self, ai_path) -> None:
        self.ai_path = ai_path
        self.process = None

    def run_setup(self):
        subprocess.run(["bash", "tiraconfig/setup.sh"], cwd=self.ai_path, check=False)

    def run_ai(self):
        runcommand = ""
        with open(
            path.join(self.ai_path, "tiraconfig/runcommand"), encoding="utf-8"
        ) as command_file:
            runcommand = command_file.readline()
        runcommand_array = runcommand.strip().split(" ")
        self.process = subprocess.Popen(
            args=runcommand_array,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            cwd=self.ai_path,
        )

        self.__check_running()

    def kill_process(self):
        self.process.kill()
        return self.process.wait()

    def __raise_runtime_error(self):
        error_msg = self.process.stderr.read().decode("utf-8")
        if error_msg == "":
            error_msg = "Could not capture error message, most likely process has already finished."
        return_code = self.process.poll()
        raise RuntimeError(
            f"Process {self.process.pid} finished with return code "
            f"{return_code}. Captured error message:\n"
            f"{error_msg}"
        )

    def __check_running(self):
        if self.process is None or self.process.poll():
            self.__raise_runtime_error()

    def play(self):
        self.__check_running()
        self.process.stdin.write("PLAY:\n".encode("utf-8"))
        self.process.stdin.flush()
        output = ""
        logs = []
        while True:
            if not self.process.stdout:
                self.__raise_runtime_error()
            output = self.process.stdout.readline().decode("utf-8")
            if not output:
                self.__raise_runtime_error()
            if output.startswith("MOVE:"):
                output = output.replace("MOVE:", "").strip()
                break
            logs.append(output)

        return output, logs

    def reset(self):
        self.__check_running()
        self.process.stdin.write("RESET:\n".encode("utf-8"))
        self.process.stdin.flush()

    def board(self, position):
        self.process.stdin.write(f"BOARD:{position}\n".encode("utf-8"))
        self.process.stdin.flush()

    def move(self, move):
        self.__check_running()
        self.process.stdin.write(f"MOVE:{move}\n".encode("utf-8"))
        self.process.stdin.flush()

    def get_pid(self):
        return self.process.pid
