export const enum Events {
  NEW_UNIT_ADDED = 'newUnitAdded',
  NEW_BUILDING_ADDED = 'newBuildingAdded',
  BUILDING_REMOVED = 'buildingRemoved',
  UNIT_REMOVED = 'unitRemoved',
  CONNECTION = 'connection',
  DISCONNECT = 'disconnect',
  PING_EVENT = 'pingEvent',
  PONG_EVENT = 'pongEvent',
  CHANGE_NAME = 'changeName',
  CHANGE_NAME_OK = 'changeNameOK',
  GET_ALL_USER_NAMES = 'getAllUserNames',
  PLAYER_DISCONNECTED = 'playerDisconnected',
  ISSUE_UNIT_COMMAND = 'issueUnitCommand',
  SERVER_STATUS_UPDATE = 'serverStatusUpdate',
  ERROR_STATUS = 'errorStatus',
  DEBUG_MESSAGE = 'debugMessage',
  PLAYER_CONSTRUCT_BUILDING = 'playerConstructBuilding',
  PLAYER_ISSUE_COMMAND = 'playerIssueCommand',
  LOAD_ALL_BUILDINGS = 'loadBuildings',
  LOAD_ALL_UNITS = 'loadUnits',
<<<<<<< HEAD
  BUILDING_DAMAGED = 'buildingDamaged',
  BUILDING_HEALED = 'buildingHealed'
=======
  UPDATE_ENTITY = 'updateEntity'
>>>>>>> cfa2edee6f463f9bff06f5e60840dffe91cf763a
}
