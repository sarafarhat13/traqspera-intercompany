import {
  ModusWcButton,
  ModusWcCheckbox,
  ModusWcTextInput,
  ModusWcTypography,
} from '@trimble-oss/moduswebcomponents-react'
import type { IntercompanyJob } from '../types/intercompany'
import { formatJobLabel } from '../data/seed'
import { readInputString } from '../utils/modusFormEvents'

type JobCheckboxPickerProps = {
  jobs: IntercompanyJob[]
  selectedJobIds: ReadonlySet<string>
  searchQuery: string
  onSearchChange: (query: string) => void
  onToggleJob: (jobId: string, checked: boolean) => void
  onSelectAllFiltered: () => void
  onClearSelection: () => void
  hasTargetTenants: boolean
}

export function JobCheckboxPicker({
  jobs,
  selectedJobIds,
  searchQuery,
  onSearchChange,
  onToggleJob,
  onSelectAllFiltered,
  onClearSelection,
  hasTargetTenants,
}: JobCheckboxPickerProps) {
  const emptyMessage = !hasTargetTenants
    ? 'Select one or more target tenants above to see jobs you can copy.'
    : searchQuery.trim()
      ? 'No jobs match the current filters that still need copying to the selected tenants.'
      : 'No jobs remain to copy for the selected tenants and department type.'

  return (
    <div className="flex min-h-0 flex-col gap-2">
      <ModusWcTextInput
        label="Search jobs"
        type="search"
        includeSearch
        includeClear
        placeholder="Job #, name, or customer…"
        value={searchQuery}
        onInputChange={(e) => onSearchChange(readInputString(e as CustomEvent))}
        size="sm"
        disabled={!hasTargetTenants}
      />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <ModusWcTypography
          hierarchy="p"
          size="sm"
          customClass="!m-0 text-[var(--modus-wc-color-base-content-low-contrast)]"
          label={`${selectedJobIds.size} selected · ${jobs.length} shown`}
        />
        <div className="flex flex-wrap gap-2">
          <ModusWcButton
            variant="outlined"
            color="tertiary"
            size="sm"
            disabled={!hasTargetTenants || jobs.length === 0}
            onButtonClick={onSelectAllFiltered}
          >
            Select all (filtered)
          </ModusWcButton>
          <ModusWcButton
            variant="borderless"
            color="tertiary"
            size="sm"
            disabled={selectedJobIds.size === 0}
            onButtonClick={onClearSelection}
          >
            Clear
          </ModusWcButton>
        </div>
      </div>

      <div className="flex min-h-0 flex-col gap-1">
        <ModusWcTypography
          hierarchy="p"
          size="sm"
          weight="semibold"
          customClass="!m-0 text-[var(--modus-wc-color-base-content)]"
          label="This list only includes jobs that have not yet been copied to all selected target tenants."
        />

        <ul
          className="ic-job-picker-list"
        role="group"
        aria-label="Jobs to copy"
      >
        {jobs.length === 0 ? (
          <li className="ic-job-picker-empty">
            <ModusWcTypography
              hierarchy="p"
              size="sm"
              customClass="!m-0 text-[var(--modus-wc-color-base-content-low-contrast)]"
              label={emptyMessage}
            />
          </li>
        ) : (
          jobs.map((job) => {
            const label = formatJobLabel(job)

            return (
              <li key={job.id} className="ic-job-picker-row">
                <ModusWcCheckbox
                  value={selectedJobIds.has(job.id)}
                  onInputChange={(e: CustomEvent) => {
                    onToggleJob(job.id, e.detail?.target?.checked ?? false)
                  }}
                  aria-label={label}
                />
                <ModusWcTypography
                  hierarchy="p"
                  size="sm"
                  customClass="!m-0 min-w-0 flex-1"
                  label={label}
                />
              </li>
            )
          })
        )}
        </ul>
      </div>
    </div>
  )
}
