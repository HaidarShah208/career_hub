import { create } from 'zustand'

interface UIState {
  isSidebarOpen: boolean
  isMobileMenuOpen: boolean
  isCommandPaletteOpen: boolean
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  toggleMobileMenu: () => void
  setMobileMenuOpen: (open: boolean) => void
  setCommandPaletteOpen: (open: boolean) => void
}

export const useUIStore = create<UIState>(set => ({
  isSidebarOpen: true,
  isMobileMenuOpen: false,
  isCommandPaletteOpen: false,
  toggleSidebar: () => set(state => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: open => set({ isSidebarOpen: open }),
  toggleMobileMenu: () => set(state => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  setMobileMenuOpen: open => set({ isMobileMenuOpen: open }),
  setCommandPaletteOpen: open => set({ isCommandPaletteOpen: open }),
}))
