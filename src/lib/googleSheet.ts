export type SheetRegistrationData = {
  name: string;
  course: string;
  regNo: string;
  stream: string;
  section: string;
  clubs: string;
  clubDomains: string;
  timestamp: string;
  url: string;
};

const SHEET_WEBHOOK_URL = import.meta.env.VITE_GOOGLE_SHEET_WEBHOOK_URL || "";

export async function submitRegistrationToGoogleSheet(data: SheetRegistrationData) {
  if (!SHEET_WEBHOOK_URL) {
    throw new Error("Missing VITE_GOOGLE_SHEET_WEBHOOK_URL");
  }

  await fetch(SHEET_WEBHOOK_URL, {
    method: "POST",
    mode: "no-cors",
    body: new URLSearchParams({
      name: data.name,
      course: data.course,
      regNo: data.regNo,
      stream: data.stream,
      section: data.section,
      clubs: data.clubs,
    }),
  });

  return { success: true };
}