interface GetDateTimeOutput {
  date: string;
  time: string;
}

export function getDateTime(): GetDateTimeOutput {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const day = currentDate.getDate().toString().padStart(2, "0");
  const date = `${year}-${month}-${day}`;
  const time = currentDate.toTimeString().slice(0, 8);
  return { date, time };
}

export function timeToSave(lastSavedTime: number): boolean {
  console.log("Time:", new Date().toTimeString().slice(0, 8));
  return Date.now() - lastSavedTime >= 5 * 60 * 1000;
}
