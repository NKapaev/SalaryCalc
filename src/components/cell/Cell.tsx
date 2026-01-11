import type { ReactNode } from 'react';

interface CellProps {
  children: ReactNode;
}

export default function Cell({ children }: CellProps) {
  return <div className="cell">{children}</div>;
}
