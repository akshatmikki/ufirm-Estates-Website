export type JobInfo = {
  Id?: number;
  Title: string;
  Type: string;
  Posted: string;
  Education: string;
  CTC: string;
  Company: string;
  Department: string;
  Designation: string;
  ImageUrl?: string;
};

const BASE_URL = "https://api.urest.in:8096/api/jobs";

export async function getJobs(search: string = ""): Promise<JobInfo[]> {
  const res = await fetch(`${BASE_URL}?search=${encodeURIComponent(search)}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch jobs: ${text}`);
  }
  const data: JobInfo[] = await res.json();
  return data;
}

export async function createJob(job: JobInfo): Promise<JobInfo> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(job),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to post job: ${text}`);
  }
  const response: { data: JobInfo } = await res.json();
  return response.data;
}

export async function deleteJob(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to delete job: ${text}`);
  }
}
