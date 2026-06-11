import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIState {
  isSidebarOpen: boolean
  isSidebarCollapsed: boolean
  isMobileMenuOpen: boolean
  isCommandPaletteOpen: boolean
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  toggleSidebarCollapsed: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleMobileMenu: () => void
  setMobileMenuOpen: (open: boolean) => void
  setCommandPaletteOpen: (open: boolean) => void
}

export const useUIStore = create<UIState>()(
  persist(
    set => ({
      isSidebarOpen: true,
      isSidebarCollapsed: false,
      isMobileMenuOpen: false,
      isCommandPaletteOpen: false,
      toggleSidebar: () => set(state => ({ isSidebarOpen: !state.isSidebarOpen })),
      setSidebarOpen: open => set({ isSidebarOpen: open }),
      toggleSidebarCollapsed: () => set(state => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
      setSidebarCollapsed: collapsed => set({ isSidebarCollapsed: collapsed }),
      toggleMobileMenu: () => set(state => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
      setMobileMenuOpen: open => set({ isMobileMenuOpen: open }),
      setCommandPaletteOpen: open => set({ isCommandPaletteOpen: open }),
    }),
    {
      name: 'pch-ui',
      partialize: state => ({ isSidebarCollapsed: state.isSidebarCollapsed }),
    },
  ),
)
