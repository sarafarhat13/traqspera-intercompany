# UX acceptance criteria — Manage Intercompany Jobs

Testable UX criteria for the **Manage Intercompany Jobs** dialog, aligned with the Traqspera intercompany prototype and README scope.

**Related:** [README](../README.md) · Prototype entry: `ManageIntercompanyJobsModal`

---

## Entry and modal shell

| ID | Criterion |
|----|-----------|
| AC-1 | From the host screen, a primary action labeled **Manage Intercompany Jobs** is visible and opens the dialog in one click/tap. |
| AC-2 | The dialog uses a clear title (**Manage Intercompany Jobs**), a visible close control, and a backdrop that blocks interaction with the page behind it until dismissed. |
| AC-3 | **Close** dismisses the dialog without requiring **Save**; reopening clears transient feedback from the previous session (e.g. success message), and job search is reset on open. |
| AC-4 | Footer actions follow a quiet-primary pattern: **Close** (outlined/tertiary) on the left, **Save** (filled primary) on the right (LTR). |
| AC-5 | On narrow viewports, modal content scrolls inside the dialog; primary actions remain reachable (sticky footer or equivalent) without losing context. |

---

## Department type filter (Delete Unused Jobs parity)

| ID | Criterion |
|----|-----------|
| AC-6 | **Department Type** is a single select with options **Job Cost**, **Overhead**, and **Work Order**. |
| AC-7 | When the dialog is opened from **Job Cost**, **Overhead**, or **Work Order**, **Department Type** is prefilled to match that module (same default mapping as **Delete Unused Jobs**). |
| AC-8 | Changing **Department Type** immediately narrows both the job checkbox list and the status table to jobs of that type only. |
| AC-9 | Job selections that are no longer visible after a filter change behave predictably per product spec (prototype keeps selections in state even when filtered out of view—confirm for production). |

---

## Job search and checkbox picker

| ID | Criterion |
|----|-----------|
| AC-10 | Job selection uses a **searchable checkbox list**, not a multiselect pill/chip control. |
| AC-11 | Search matches job **number**, **name**, and **customer** (case-insensitive); multi-word queries require **all** tokens to match (AND). |
| AC-12 | Search supports clear/reset via the field’s clear affordance when provided. |
| AC-13 | A summary line shows **N selected · M shown**, where **M** counts selectable jobs in the current filter + search result set. |
| AC-14 | **Select all (filtered)** checks every **non-copied** job in the current filtered list; already-copied jobs are skipped. |
| AC-15 | **Clear** removes all job checkbox selections. |
| AC-16 | When no jobs match filters/search, the list shows **No jobs match the current filters.** (not a blank area). |
| AC-17 | Helper copy explains that jobs already copied to **all selected tenants** appear greyed, show **(copied)**, and cannot be selected again. |

---

## Already-copied jobs

| ID | Criterion |
|----|-----------|
| AC-18 | A job is treated as copied only when it already has a copy for **every currently selected target tenant** (not just one tenant). |
| AC-19 | Copied jobs remain **visible** in the list (not hidden). |
| AC-20 | Copied jobs are **visually de-emphasized** (greyed/low contrast) and append **(copied)** to the label in both the picker and the table **Job** column. |
| AC-21 | Copied jobs have checkboxes **disabled** and cannot be toggled on. |
| AC-22 | Changing target tenant selection recalculates which jobs count as copied (a job may become selectable again if not copied to all newly selected tenants). |

---

## Copy to tenants

| ID | Criterion |
|----|-----------|
| AC-23 | Target tenants are chosen via a **checkbox list** (one row per tenant), not a multiselect pill control. |
| AC-24 | At least one target tenant must be selected to run **Save**; with zero tenants, **Save** shows validation feedback (see Save flow). |
| AC-25 | Default tenant selection on first open matches product rules (prototype preselects two tenants—confirm against Traqspera spec if different in production). |

---

## Save, validation, and feedback

| ID | Criterion |
|----|-----------|
| AC-26 | **Save** is disabled or shows **Saving…** while the copy operation is in progress; double-submit does not duplicate copies. |
| AC-27 | If no eligible jobs are selected (none checked, or only copied jobs), **Save** shows: **Select at least one job and one target tenant.** |
| AC-28 | On successful copy, a success message states how many **job–tenant pair(s)** were copied and that status updated **without a full page refresh**. |
| AC-29 | If the user selects jobs that need no new copies for the chosen tenants, feedback explains that copies already exist (no silent failure). |
| AC-30 | After **Save**, successfully copied jobs update **in-modal** (picker + table); the host page does not reload. |
| AC-31 | After **Save**, completed job selections are cleared from the checkbox picker (copied rows become disabled/greyed). |
| AC-32 | Status/success text is exposed to assistive tech (`aria-live="polite"` or equivalent) so screen reader users hear the outcome. |

---

## Status table

| ID | Criterion |
|----|-----------|
| AC-33 | A status table appears in the dialog with columns **Job**, **Original Tenant**, and **Tenants With Copy**. |
| AC-34 | Table rows respect the same **Department Type** and **search** filters as the job picker. |
| AC-35 | **Job** cells use **(copied)** and muted styling when the job is copied to all selected target tenants (consistent with the picker). |
| AC-36 | **Tenants With Copy** shows one badge (or equivalent tag) per tenant that has a copy, using readable tenant names. |
| AC-37 | After **Save**, new copies appear in **Tenants With Copy** without leaving the dialog. |
| AC-38 | Table uses zebra striping (or equivalent) for scanability on long lists. |

---

## Accessibility and keyboard

| ID | Criterion |
|----|-----------|
| AC-39 | All interactive controls have accessible names (checkboxes via `aria-label` or associated text; icon buttons labeled). |
| AC-40 | Focus moves into the dialog on open and is trapped until close; **Esc** and the close control dismiss the dialog; focus returns to a sensible element on close. |
| AC-41 | Users can complete the flow using keyboard only: search, filter, select jobs/tenants, **Save**, **Close**. |
| AC-42 | Disabled copied-job checkboxes are not focusable for activation, or activating them does not change selection. |
| AC-43 | Section headings (**Jobs To Copy**, **Copy To Tenants**) are programmatically associated with their regions (`aria-labelledby` / landmarks). |

---

## Visual and design system (Modus / Traqspera)

| ID | Criterion |
|----|-----------|
| AC-44 | UI uses Modus components (modal, buttons, selects, text input, checkboxes, table, badges, typography)—no ad-hoc HTML controls that duplicate Modus patterns. |
| AC-45 | Primary **Save** includes a leading icon; de-emphasized actions use tertiary/outlined styling (not misuse of **secondary** button color for “second button”). |
| AC-46 | Text and surfaces follow theme tokens (light/dark); copied/greyed states remain readable (contrast not color-only). |
| AC-47 | Form fields use bordered inputs consistent with Traqspera dense forms (not borderless filter fields unless explicitly specified). |

---

## Edge cases (UX)

| ID | Criterion |
|----|-----------|
| AC-48 | **Select all (filtered)** + change search: only jobs matching the **current** filter/search are affected. |
| AC-49 | Partial copies (job copied to some but not all selected tenants) remain **selectable** until copied to **all** selected targets. |
| AC-50 | Copying the same job to multiple selected tenants in one **Save** updates all applicable tenant badges in one action. |

---

## Sign-off checklist (QA)

Use when verifying a build (prototype or integrated Traqspera):

- [ ] AC-1–AC-5 Modal shell and entry
- [ ] AC-6–AC-9 Department type prefill and filtering
- [ ] AC-10–AC-17 Job search and checkbox picker
- [ ] AC-18–AC-22 Already-copied treatment
- [ ] AC-23–AC-25 Target tenants
- [ ] AC-26–AC-32 Save and feedback
- [ ] AC-33–AC-38 Status table
- [ ] AC-39–AC-43 Accessibility
- [ ] AC-44–AC-47 Modus / visual
- [ ] AC-48–AC-50 Edge cases
