import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'

// Mock next/navigation
const mockReplace = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
  usePathname: () => '/dashboard',
}))

// Mock useAuth
const mockUseAuth = vi.fn()
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}))

// Mock child components to isolate layout logic
vi.mock('@/components/layout/Sidebar', () => ({ default: () => <div data-testid="sidebar" /> }))
vi.mock('@/components/layout/Header', () => ({ default: () => <div data-testid="header" /> }))

import DashboardLayout from '@/app/(dashboard)/layout'

describe('DashboardLayout', () => {
  beforeEach(() => {
    mockReplace.mockClear()
  })

  it('shows loading spinner while auth state is loading', () => {
    mockUseAuth.mockReturnValue({ user: null, loading: true })
    render(<DashboardLayout><div>content</div></DashboardLayout>)
    expect(screen.queryByTestId('sidebar')).toBeNull()
    expect(screen.queryByText('content')).toBeNull()
  })

  it('redirects to /login when user is not authenticated', () => {
    mockUseAuth.mockReturnValue({ user: null, loading: false })
    render(<DashboardLayout><div>content</div></DashboardLayout>)
    expect(mockReplace).toHaveBeenCalledWith('/login')
  })

  it('renders sidebar, header and children when user is authenticated', () => {
    mockUseAuth.mockReturnValue({ user: { displayName: 'Indigo' }, loading: false })
    render(<DashboardLayout><div>content</div></DashboardLayout>)
    expect(screen.getByTestId('sidebar')).toBeDefined()
    expect(screen.getByTestId('header')).toBeDefined()
    expect(screen.getByText('content')).toBeDefined()
  })
})
