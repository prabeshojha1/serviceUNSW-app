import { PropsWithChildren, createContext, useContext, useMemo, useState } from 'react';

interface SocietyContextValue {
  joinedIds: string[];
  toggleJoined: (id: string) => void;
}

const SocietyContext = createContext<SocietyContextValue | null>(null);

export function SocietyProvider({ children }: PropsWithChildren) {
  const [joinedIds, setJoinedIds] = useState(['csesoc', 'motorsport']);

  const value = useMemo(
    () => ({
      joinedIds,
      toggleJoined: (id: string) =>
        setJoinedIds((current) =>
          current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
        ),
    }),
    [joinedIds],
  );

  return <SocietyContext.Provider value={value}>{children}</SocietyContext.Provider>;
}

export function useSocieties() {
  const value = useContext(SocietyContext);
  if (!value) throw new Error('useSocieties must be used inside SocietyProvider');
  return value;
}
