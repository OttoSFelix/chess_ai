class Logger:
    """A simple logger for storing and retrieving log messages.

    Attributes:
        __logs (list): A list to store log messages.
    """

    def __init__(self):
        self.__logs = []

    def log(self, message: str):
        """
        Adds a message to the logs.
        """
        self.__logs.append(message)

    def get_and_clear_logs(self) -> str:
        """
        Returns the accumulated logs as a single string and clears the log buffer.
        """
        current_logs = "\n".join(self.__logs)
        self.__logs = []
        return current_logs
