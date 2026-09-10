import { useMemo } from 'react'
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
  isJobCopiedToTargets: (job: IntercompanyJob) => boolean
}

export function JobCheckboxPicker({
  jobs,
  selectedJobIds,
  searchQuery,
  onSearchChange,
  onToggleJob,
  onSelectAllFiltered,
  onClearSelection,
  isJobCopiedToTargets,
}: JobCheckboxPickerProps) {
  const selectableCount = useMemo(
    () => jobs.filter((job) => !isJobCopiedToTargets(job)).length,
    [jobs, isJobCopiedToTargets],
  )

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
      />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <ModusWcTypography
          hierarchy="p"
          size="sm"
          customClass="!m-0 text-[var(--modus-wc-color-base-content-low-contrast)]"
          label={`${selectedJobIds.size} selected · ${selectableCount} shown`}
        />
        <div className="flex flex-wrap gap-2">
          <ModusWcButton
            variant="outlined"
            color="tertiary"
            size="sm"
            onButtonClick={onSelectAllFiltered}
          >
            Select all (filtered)
          </ModusWcButton>
          <ModusWcButton
            variant="borderless"
            color="tertiary"
            size="sm"
            onButtonClick={onClearSelection}
          >
            Clear
          </ModusWcButton>
        </div>
      </div>

      <ModusWcTypography
        hierarchy="p"
        size="sm"
        customClass="!m-0 text-[var(--modus-wc-color-base-content-low-contrast)]"
        label='Jobs already copied to all selected tenants appear greyed with "(copied)" and cannot be selected again.'
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
              label="No jobs match the current filters."
            />
          </li>
        ) : (
          jobs.map((job) => {
            const copied = isJobCopiedToTargets(job)
            const label = copied
              ? `${formatJobLabel(job)} (copied)`
              : formatJobLabel(job)

            return (
              <li
                key={job.id}
                className={copied ? 'ic-job-picker-row ic-job-picker-row--copied' : 'ic-job-picker-row'}
              >
                <ModusWcCheckbox
                  value={selectedJobIds.has(job.id)}
                  disabled={copied}
                  onInputChange={(e: CustomEvent) => {
                    if (!copied) {
                      onToggleJob(job.id, e.detail?.target?.checked ?? false)
                    }
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
  )
}
