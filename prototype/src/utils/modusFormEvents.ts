/** Read string value from Modus `inputChange` (React wrapper may expose `e.target` directly). */
export function readInputString(e: CustomEvent): string {
  const hostTarget = e.target as HTMLInputElement | HTMLSelectElement | null | undefined
  if (hostTarget?.value != null) return hostTarget.value

  const detail = e.detail as InputEvent | undefined
  const nested = detail?.target as HTMLInputElement | HTMLSelectElement | null | undefined
  if (nested?.value != null) return nested.value

  return ''
}

export function readInputChecked(e: CustomEvent): boolean {
  const target = e.detail?.target as HTMLInputElement | undefined
  return Boolean(target?.checked)
}
