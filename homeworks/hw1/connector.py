import requests
import json


class Connector(object):
    def __init__(self, endpoint: str, getPath: str, postPath: str) -> None:
        super().__init__()
        self.__endpoint: str = endpoint
        self.__getPath: str = getPath
        self.__postPath: str = postPath

    def getChallenge(self) -> requests.Response:
        return requests.get(url=f'{self.__endpoint}{self.__getPath}')

    async def attemptChallenge(self, data: dict) -> requests.Response:
        headers = {'content-type': 'application/json'}
        return requests.post(url=f'{self.__endpoint}{self.__postPath}', headers=headers, data=json.dumps(data), timeout=None)
