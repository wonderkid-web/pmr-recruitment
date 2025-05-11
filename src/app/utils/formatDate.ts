export function formatDate(dateInput: string | Date, isForDisplay: boolean = true): string {
  const date = new Date(dateInput);

  if (isForDisplay) {
     return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
     }).format(date);
  }

  return date.toISOString();
}
