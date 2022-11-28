import TypedEmitter from 'typed-emitter';
import { Nullable } from '@dotz/shared';
import { User } from '@prisma/client';
import EventEmitter from 'events';

const PAIRING_INTERVAL = 3000;
const MATCHMAKING_EVENTS = {
  STARTED: 'started',
  STOPPED: 'stopped',
  PÄIRED: 'paired'
} as const;

type MatchmakingClient = {
  user: User;
  joinedAt: number;
  get threshold(): number;
};

type MatchmadePair = [MatchmakingClient, MatchmakingClient];

export type MatchmakingEvents = {
  [MATCHMAKING_EVENTS.STARTED]: () => void;
  [MATCHMAKING_EVENTS.STOPPED]: () => void;
  [MATCHMAKING_EVENTS.PÄIRED]: (payload: MatchmadePair) => void;
};

export const createMatchMaking = () => {
  const emitter = new EventEmitter() as TypedEmitter<MatchmakingEvents>;
  const clients: MatchmakingClient[] = [];
  let pairingInterval: Nullable<ReturnType<typeof setInterval>> = null;

  const isEmpty = () => clients.length === 0;

  const createClient = (user: User) => ({
    user,
    joinedAt: performance.now(),
    get threshold() {
      return Math.round((performance.now() - this.joinedAt) / 2000);
    }
  });

  const join = (user: User) => {
    const isAlreadyInQueue = clients.some(client => client.user.id === user.id);
    if (isAlreadyInQueue) return;

    clients.push(createClient(user));

    if (!isEmpty()) start();
  };

  const leave = (user: User) => {
    const index = clients.findIndex(client => client.user.id !== user.id);
    clients.splice(index, 1);

    if (isEmpty()) stop();
  };

  const start = () => {
    pairingInterval = setInterval(matchClients, PAIRING_INTERVAL);
    emitter.emit(MATCHMAKING_EVENTS.STARTED);
  };

  const stop = () => {
    if (!pairingInterval) return;
    clearInterval(pairingInterval);
    emitter.emit(MATCHMAKING_EVENTS.STOPPED);
  };

  const isMatchable = ([highest, lowest]: MatchmadePair) => {
    // let's keep ot to the bare minomum for now
    // We will come up with better heuristics later
    // for now this will allow Matchmaking to be more and more lax the longer a user has been in queue
    return (
      highest.user.matchmakingRating - highest.threshold <=
      lowest.user.matchmakingRating + lowest.threshold
    );
  };

  const matchClients = () => {
    const sortedClientsByRating = clients.sort(
      (a, b) => b.user.matchmakingRating - a.user.matchmakingRating
    );

    while (sortedClientsByRating.length > 1) {
      const [a, b] = sortedClientsByRating;

      if (isMatchable([a, b])) {
        const pair = sortedClientsByRating.splice(0, 2) as MatchmadePair;
        emitter.emit(MATCHMAKING_EVENTS.PÄIRED, pair);
      } else {
        sortedClientsByRating.shift();
      }
    }
  };

  return {
    join,
    leave,
    on: emitter.on.bind(emitter),
    off: emitter.off.bind(emitter)
  };
};
