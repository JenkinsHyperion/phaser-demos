import { getIo } from '../utils/server';
import { getSeed } from '../utils/seed';
import { Engine, World, Bodies, Body } from 'matter-js';
import Building from '../models/entities/building';
import Unit from '../models/entities/unit';
import { Events } from '../models/schemas/eventConstants';
import Entity from '../models/entities/entity';

class ServerScene {
  public players: Players = {};
  public units: Units = {};
  public buildings: Buildings = {};

  private io = getIo();

  private pingNamespace: SocketIO.Namespace;
  private engine: Engine;
  private box: Body;
  private ground: Body;
  private world: World;

  // public testUnit: Unit;

  constructor() {
    this.init();
  }

  public init() {
    // this.testUnit = new Unit(this, 0, 0);
    this.handleSockets();
    this.initPhysics();
    this.startPhysicsUpdate();
    this.startServerUpdateTick();
  }

  public sendUnitPositions() {
    //for each unit on map, key value pair for owning player ID
    // return this.testUnit.getPosition();
    // const { x, y } = this.box.position;
    // return { x, y };
  }

  public addEntityToSceneAndNotify(group, newEntity, notifier: Events, targetId?: string) {
    console.log('Adding entity to server scene...');
    const { x, y } = newEntity.body.position;
    const { ownerId } = newEntity;
    const id = newEntity.id;
    console.log(`Entity '${newEntity.id}' added at: ${x}, ${y}`);
    group[newEntity.id] = newEntity;
    World.add(this.world, newEntity.body);
    this.io.emit(notifier, { x, y, id, ownerId, targetId });
  }

  public notifyClientOfEntity(clientSocket: SocketIO.Socket, newEntity, notifier: Events, targetId?: string) {
    const { x, y } = newEntity.body.position;
    const { ownerId } = newEntity;
    const id = newEntity.id;
    clientSocket.emit(notifier, { x, y, id, ownerId, targetId });
  }

  public handleSockets() {
    this.pingNamespace = this.io.of('/ping-namespace');
    this.pingNamespace.on(Events.CONNECTION, (socket) => {
      socket.on(Events.PING_EVENT, () => {
        socket.emit(Events.PONG_EVENT);
      });
    });

    this.io.on(Events.CONNECTION, (socket) => {
      console.log('user connected');
      this.players[socket.id] = {
        id: socket.id,
        name: `Player${Math.round(Math.random() * 1000) + 1}`
      };
      socket.broadcast.emit(Events.CONNECTION, this.players[socket.id].name);
      // load enttiies to client when client connects
      Object.keys(this.buildings).forEach((currentId) => {
        //addBuildingToScene(buildings[currentId]);
        this.notifyClientOfEntity(socket, this.buildings[currentId], Events.NEW_BUILDING_ADDED);
      });
      //todo units

      socket.on(Events.CHANGE_NAME, (name) => {
        // this.addUnitToSceneAndNotify(new Unit(this, 50, 50));
        this.players[socket.id].name = name;
        socket.emit(Events.CHANGE_NAME_OK, this.players[socket.id].name);
        // socket.emit('errorStatus', 'Could not change name');
      });

      socket.on(Events.GET_ALL_USER_NAMES, () => {
        socket.emit(Events.GET_ALL_USER_NAMES, Object.values(this.players).map((player) => player.name));
      });

      socket.on(Events.PLAYER_DISCONNECTED, () => {
        socket.disconnect();
      });
      socket.on(Events.DISCONNECT, () => {
        console.log('user disconnected');
        this.io.emit(Events.DISCONNECT, this.players[socket.id].name);
        delete this.players[socket.id];
      });
      socket.on(Events.ISSUE_UNIT_COMMAND, () => {});

      socket.on(Events.PLAYER_CONSTRUCT_BUILDING, (data: { x: number; y: number }) => {
        const { x, y } = data;
        const newBuilding = new Building({ x, y }, 30, socket.id);
        this.addEntityToSceneAndNotify(this.buildings, newBuilding, Events.NEW_BUILDING_ADDED);
      });
      socket.on(
        Events.PLAYER_ISSUE_COMMAND,
        (data: { x: number; y: number; selectedId: string; targetId: string }) => {
          const { x, y, targetId } = data;
          const newUnit = new Unit({ x, y }, 30, socket.id, this.findBuildingById(targetId));
          this.addEntityToSceneAndNotify(this.units, newUnit, Events.NEW_UNIT_ADDED, targetId);
        }
      );
    });
  }

  public findBuildingById(id: string): Building {
    let building = this.buildings[id] ? this.buildings[id] : null;
    if (!building) throw new Error('Building could not be found');
    return building;
  }

  public findUnitById(id: string): Unit {
    let unit = this.units[id] ? this.units[id] : null;
    if (!unit) throw new Error('Unit could not be found');
    return unit;
  }

  public startServerUpdateTick() {
    setInterval(() => {
      this.io.emit(Events.SERVER_STATUS_UPDATE, this.sendUnitPositions());
    }, 1000 / 30);
  }

  public initPhysics() {
    this.engine = Engine.create();
    this.world = this.engine.world;
    // this.box = Bodies.rectangle(400, 200, 80, 80);
    // this.ground = Bodies.rectangle(400, 500, 500, 30, { isStatic: true });
    // this.add.rectangle(400, 50, 500, 30, 0xffffff);
    // this.addEntityToSceneAndNotify(this.box);
    // World.add(world, [this.box, this.ground]);
  }

  public startPhysicsUpdate() {
    setInterval(() => {
      // Body.applyForce(this.box, { x: 0, y: 0 }, { x: 0, y: -0.1 });
      // this.box.position.x += 0.05;
      Engine.update(this.engine, 1000 / 60);
    }, 1000 / 60);
  }
}
export default ServerScene;