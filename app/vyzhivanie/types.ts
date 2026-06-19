export type TontineUserState =
  | { joined: false }
  | {
      joined: true;
      participantId: string;
      displayName: string;
      status: 'ALIVE' | 'ELIMINATED' | 'WINNER';
      checkInStreak: number;
      lastCheckInDate: string | null;
      lastCheckInAt: string | null;
      canCheckInToday: boolean;
      checkedInToday: boolean;
      eliminatedAt: string | null;
      joinedAt: string;
    };

export type TontineGrave = {
  id: string;
  userId: string;
  displayName: string;
  x: number;
  y: number;
  joinedAt: string;
  eliminatedAt: string;
  lastCheckInAt: string | null;
};

export type TontineStatusResponse = {
  roundId: string;
  roundNumber: number;
  status: 'ACTIVE' | 'FINISHED';
  startedAt: string;
  finishedAt: string | null;
  daysRunning: number;
  aliveCount: number;
  eliminatedCount: number;
  totalParticipants: number;
  prizeRub: number;
  winner: {
    id: string;
    username: string | null;
    name: string | null;
    avatar: string | null;
  } | null;
  user: TontineUserState;
  isAuthenticated: boolean;
  serverNow: string;
  graves: TontineGrave[];
};
