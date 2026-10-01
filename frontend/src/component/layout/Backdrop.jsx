import React from 'react';
import { useSidebar } from '../../context/SidebarContext';

export default function Backdrop() {
  const { isMobileOpen, setIsMobileOpen } = useSidebar();

  if (!isMobileOpen) return null;

  return (
    <div
      className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden transition-opacity"
      onClick={() => setIsMobileOpen(false)}
    />
  );
}
