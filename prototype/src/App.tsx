import { ManageIntercompanyJobsModal } from './components/ManageIntercompanyJobsModal'

export default function App() {
  return (
    <main
      id="main-content"
      className="flex min-h-dvh items-start bg-[var(--modus-wc-color-base-page)] p-4 sm:p-6"
    >
      <ManageIntercompanyJobsModal openingModule="jobCost" />
    </main>
  )
}
