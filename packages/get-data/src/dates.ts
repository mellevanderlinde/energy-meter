export function getDates(numberOfDays: number): string[] {
  const dates: string[] = [];
  const today = new Date();

  for (let i = 0; i < numberOfDays; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    dates.push(`${year}-${month}-${day}`);
  }

  return dates;
}
