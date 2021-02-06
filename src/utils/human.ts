export function humanizeBool(bool: boolean, ucfirst = true): string {
  const out = bool ? 'Yes' : 'No';
  return ucfirst ? out : out.toLowerCase();
}
