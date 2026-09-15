import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ModusWcButton,
  ModusWcIcon,
  ModusWcModal,
  ModusWcSelect,
  ModusWcTable,
  ModusWcTypography,
} from '@trimble-oss/moduswebcomponents-react'
import type { ISelectOption, ITableColumn } from '@trimble-oss/moduswebcomponents'
import { INITIAL_JOBS, TENANTS, formatJobLabel, getTenantName } from '../data/seed'
import type { CopyResult, IntercompanyJob, JobModuleType } from '../types/intercompany'
import {
  buildDepartmentTypeOptions,
  getDefaultDepartmentType,
} from '../utils/departmentFilterDefaults'
import { readInputString } from '../utils/modusFormEvents'
import { jobMatchesSearch } from '../utils/jobSearch'
import { JobCheckboxPicker } from './JobCheckboxPicker'
import { TenantCheckboxPicker } from './TenantCheckboxPicker'

const MODAL_ID = 'manage-intercompany-jobs-modal'

type ManageIntercompanyJobsModalProps = {
  openingModule: JobModuleType
}

function jobsForFilters(
  jobs: IntercompanyJob[],
  departmentType: JobModuleType,
  searchQuery: string,
): IntercompanyJob[] {
  const byType = jobs.filter((job) => job.jobType === departmentType)
  if (!searchQuery.trim()) return byType
  return byType.filter((job) => jobMatchesSearch(job, searchQuery))
}

function simulateCopyApi(
  jobIds: string[],
  tenantIds: string[],
  jobs: IntercompanyJob[],
): CopyResult[] {
  const results: CopyResult[] = []
  for (const jobId of jobIds) {
    const job = jobs.find((j) => j.id === jobId)
    if (!job) continue
    for (const tenantId of tenantIds) {
      if (!job.tenantsWithCopy.includes(tenantId)) {
        results.push({ jobId, tenantId })
      }
    }
  }
  return results
}

function applyCopyResults(
  jobs: IntercompanyJob[],
  results: CopyResult[],
): IntercompanyJob[] {
  if (results.length === 0) return jobs

  const copyMap = new Map<string, Set<string>>()
  for (const { jobId, tenantId } of results) {
    const existing = copyMap.get(jobId) ?? new Set<string>()
    existing.add(tenantId)
    copyMap.set(jobId, existing)
  }

  return jobs.map((job) => {
    const added = copyMap.get(job.id)
    if (!added) return job
    const merged = new Set([...job.tenantsWithCopy, ...added])
    return { ...job, tenantsWithCopy: [...merged] }
  })
}

export function ManageIntercompanyJobsModal({
  openingModule,
}: ManageIntercompanyJobsModalProps) {
  const [jobs, setJobs] = useState<IntercompanyJob[]>(() =>
    INITIAL_JOBS.map((j) => ({ ...j, tenantsWithCopy: [...j.tenantsWithCopy] })),
  )
  const [selectedJobIds, setSelectedJobIds] = useState<Set<string>>(new Set())
  const [selectedTenantIds, setSelectedTenantIds] = useState<Set<string>>(
    () => new Set(['tenant-vista', 'tenant-elearn']),
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [departmentType, setDepartmentType] = useState<JobModuleType>(() =>
    getDefaultDepartmentType(openingModule),
  )
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)

  const departmentTypeOptions = useMemo<ISelectOption[]>(
    () => buildDepartmentTypeOptions(),
    [],
  )

  const isJobCopiedToTargets = useCallback(
    (job: IntercompanyJob) => {
      if (selectedTenantIds.size === 0) return false
      return [...selectedTenantIds].every((tenantId) =>
        job.tenantsWithCopy.includes(tenantId),
      )
    },
    [selectedTenantIds],
  )

  const filteredPickerJobs = useMemo(
    () => jobsForFilters(jobs, departmentType, searchQuery),
    [jobs, departmentType, searchQuery],
  )

  const visiblePickerJobs = useMemo(
    () =>
      selectedTenantIds.size === 0
        ? []
        : filteredPickerJobs.filter((job) => !isJobCopiedToTargets(job)),
    [filteredPickerJobs, selectedTenantIds.size, isJobCopiedToTargets],
  )

  useEffect(() => {
    const visibleIds = new Set(visiblePickerJobs.map((job) => job.id))
    setSelectedJobIds((prev) => {
      let changed = false
      const next = new Set<string>()
      for (const id of prev) {
        if (visibleIds.has(id)) next.add(id)
        else changed = true
      }
      if (!changed && next.size === prev.size) return prev
      return next
    })
  }, [visiblePickerJobs])

  const tableRows = useMemo(() => {
    return jobsForFilters(jobs, departmentType, searchQuery)
      .map((job) => {
        const copied = isJobCopiedToTargets(job)
        const jobLabel = copied
          ? `${formatJobLabel(job)} (copied)`
          : formatJobLabel(job)

        return {
          id: job.id,
          job: jobLabel,
          jobCopied: copied,
          originalTenant: getTenantName(job.originalTenantId, TENANTS),
          tenantIds: job.tenantsWithCopy,
        }
      })
  }, [jobs, departmentType, searchQuery, isJobCopiedToTargets])

  const openModal = () => {
    setSaveMessage(null)
    setSearchQuery('')
    ;(document.getElementById(MODAL_ID) as HTMLDialogElement | null)?.showModal()
  }

  const closeModal = () => {
    ;(document.getElementById(MODAL_ID) as HTMLDialogElement | null)?.close()
  }

  const toggleJob = (jobId: string, checked: boolean) => {
    setSelectedJobIds((prev) => {
      const next = new Set(prev)
      if (checked) next.add(jobId)
      else next.delete(jobId)
      return next
    })
  }

  const selectAllFiltered = () => {
    setSelectedJobIds((prev) => {
      const next = new Set(prev)
      for (const job of visiblePickerJobs) {
        next.add(job.id)
      }
      return next
    })
  }

  const clearSelection = () => setSelectedJobIds(new Set())

  const handleSave = async () => {
    const jobsToCopy = [...selectedJobIds].filter((id) => {
      const job = jobs.find((j) => j.id === id)
      return job && !isJobCopiedToTargets(job)
    })

    if (jobsToCopy.length === 0 || selectedTenantIds.size === 0) {
      setSaveMessage('Select at least one job and one target tenant.')
      return
    }

    setSaving(true)
    setSaveMessage(null)

    await new Promise((resolve) => setTimeout(resolve, 400))

    const results = simulateCopyApi(jobsToCopy, [...selectedTenantIds], jobs)
    setJobs((prev) => applyCopyResults(prev, results))
    setSelectedJobIds((prev) => {
      const next = new Set(prev)
      for (const jobId of jobsToCopy) next.delete(jobId)
      return next
    })

    setSaving(false)
    setSaveMessage(
      results.length > 0
        ? `Copied ${results.length} job–tenant pair(s). Status updated below — no page refresh needed.`
        : 'Selected jobs already have copies for the chosen tenants.',
    )
  }

  const tableColumns = useMemo<ITableColumn[]>(
    () => [
      {
        id: 'job',
        header: 'Job',
        accessor: 'job',
        cellRenderer: (value: unknown, row: unknown) => {
          const span = document.createElement('span')
          const typedRow = row as { jobCopied?: boolean }
          if (typedRow.jobCopied) {
            span.className = 'ic-table-job-copied'
          }
          span.textContent = String(value ?? '')
          return span
        },
      },
      {
        id: 'originalTenant',
        header: 'Original Tenant',
        accessor: 'originalTenant',
      },
      {
        id: 'tenantsWithCopy',
        header: 'Tenants With Copy',
        accessor: 'tenantIds',
        cellRenderer: (value: unknown) => {
          const tenantIds = Array.isArray(value) ? (value as string[]) : []
          const wrap = document.createElement('div')
          wrap.className = 'ic-tenant-badges'
          for (const tenantId of tenantIds) {
            const badge = document.createElement('modus-wc-badge')
            badge.setAttribute('size', 'sm')
            badge.setAttribute('variant', 'filled')
            badge.textContent = getTenantName(tenantId, TENANTS)
            wrap.appendChild(badge)
          }
          return wrap
        },
      },
    ],
    [],
  )

  return (
    <>
      <ModusWcButton variant="filled" color="primary" size="sm" onButtonClick={openModal}>
        <ModusWcIcon name="copy" size="xs" decorative />
        Manage Intercompany Jobs
      </ModusWcButton>

      <ModusWcModal
        modalId={MODAL_ID}
        backdrop="default"
        position="center"
        showClose
        fullscreen
        aria-label="Manage Intercompany Jobs"
      >
        <span slot="header">Manage Intercompany Jobs</span>

        <div slot="content" className="ic-modal-content">
          <div className="ic-modal-scroll">
            <section
              className="flex flex-col gap-3"
              aria-labelledby="copy-to-tenants-heading"
            >
              <ModusWcTypography
                id="copy-to-tenants-heading"
                hierarchy="h3"
                size="md"
                weight="semibold"
                label="Copy To Tenants"
              />
              <TenantCheckboxPicker
                tenants={TENANTS}
                selectedTenantIds={selectedTenantIds}
                onToggleTenant={(tenantId, checked) => {
                  setSelectedTenantIds((prev) => {
                    const next = new Set(prev)
                    if (checked) next.add(tenantId)
                    else next.delete(tenantId)
                    return next
                  })
                }}
              />
            </section>

            <section className="flex flex-col gap-3" aria-labelledby="jobs-to-copy-heading">
              <ModusWcTypography
                id="jobs-to-copy-heading"
                hierarchy="h3"
                size="md"
                weight="semibold"
                label="Jobs To Copy"
              />

              <ModusWcSelect
                label="Department Type"
                value={departmentType}
                options={departmentTypeOptions}
                size="sm"
                onInputChange={(e: CustomEvent) =>
                  setDepartmentType(readInputString(e) as JobModuleType)
                }
              />

              <JobCheckboxPicker
                jobs={visiblePickerJobs}
                selectedJobIds={selectedJobIds}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onToggleJob={toggleJob}
                onSelectAllFiltered={selectAllFiltered}
                onClearSelection={clearSelection}
                hasTargetTenants={selectedTenantIds.size > 0}
              />
            </section>

            {saveMessage ? (
              <ModusWcTypography
                hierarchy="p"
                size="sm"
                customClass="!m-0 text-[var(--modus-wc-color-primary)]"
                label={saveMessage}
                aria-live="polite"
              />
            ) : null}

            <div className="ic-modal-table-wrap">
              <ModusWcTable
                columns={tableColumns}
                data={tableRows}
                zebra
                customClass="ic-intercompany-table"
              />
            </div>
          </div>

          <div className="ic-modal-footer" role="group" aria-label="Modal actions">
            <ModusWcButton
              variant="outlined"
              color="tertiary"
              size="sm"
              onButtonClick={closeModal}
            >
              <ModusWcIcon name="close" size="xs" decorative />
              Close
            </ModusWcButton>
            <ModusWcButton
              variant="filled"
              color="primary"
              size="sm"
              disabled={saving}
              onButtonClick={handleSave}
            >
              <ModusWcIcon name="check" size="xs" decorative />
              {saving ? 'Saving…' : 'Save'}
            </ModusWcButton>
          </div>
        </div>
      </ModusWcModal>
    </>
  )
}
