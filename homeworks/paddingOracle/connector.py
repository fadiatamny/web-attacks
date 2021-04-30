import requests
import json
from time import sleep

class Connector(object):
    def __init__(self, endpoint: str, getPath: str, postPath: str) -> None:
        super().__init__()
        self.__endpoint: str = endpoint
        self.__getPath: str = getPath
        self.__postPath: str = postPath

    def getChallenge(self) -> requests.Response:
        return requests.get(url=f'{self.__endpoint}{self.__getPath}')

    def attemptChallenge(self, data: dict) -> requests.Response:
        sleep(0.01) #to stop max retries
        headers = {'content-type': 'application/json'}
        return requests.post(url=f'{self.__endpoint}{self.__postPath}', headers=headers, data=json.dumps(data), timeout=None)
