import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  createMyCompany,
  getEmployerAnalytics,
  getEmployerDashboard,
  getMyCompany,
  updateMyCompany,
  type CompanyInput,
} from '../api/employer.api'

export const employerCompanyKeys = {
  company: ['employer', 'company'] as const,
  dashboard: ['employer', 'dashboard'] as const,
  analytics: ['employer', 'analytics'] as const,
}

/** The employer's single company (null until they create one). */
export function useEmployerCompany() {
  const queryClient = useQueryClient()
  const query = useQuery({
    queryKey: employerCompanyKeys.company,
    queryFn: getMyCompany,
  })

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: employerCompanyKeys.company })
    queryClient.invalidateQueries({ queryKey: employerCompanyKeys.dashboard })
  }

  const create = useMutation({
    mutationFn: (input: CompanyInput) => createMyCompany(input),
    onSuccess: invalidate,
  })
  const update = useMutation({
    mutationFn: (input: Partial<CompanyInput>) => updateMyCompany(input),
    onSuccess: invalidate,
  })

  return {
    company: query.data ?? null,
    isLoading: query.isLoading,
    hasCompany: Boolean(query.data),
    saveCompany: (input: CompanyInput) =>
      query.data ? update.mutateAsync(input) : create.mutateAsync(input),
    isSaving: create.isPending || update.isPending,
  }
}

/** Employer dashboard analytics. */
export function useEmployerDashboard() {
  const query = useQuery({
    queryKey: employerCompanyKeys.dashboard,
    queryFn: getEmployerDashboard,
    retry: false,
  })
  return {
    dashboard: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
  }
}

/** Charts and performance metrics for overview + analytics pages. */
export function useEmployerAnalytics() {
  const query = useQuery({
    queryKey: employerCompanyKeys.analytics,
    queryFn: getEmployerAnalytics,
    retry: false,
    refetchOnWindowFocus: true,
    staleTime: 30_000,
  })
  return {
    analytics: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
  }
}
