export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export const apiPost = async <T,>(endpoint: string, payload: unknown) => {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Request failed");
  }

  return (await response.json()) as T;
};

export const apiUpload = async <T,>(endpoint: string, formData: FormData) => {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Upload failed");
  }

  return (await response.json()) as T;
};

export const buildOutputFiles = (paths: string[], id: string) =>
  paths.map((path) => {
    const name = path.split("/").slice(-1)[0];
    const url = `${API_BASE}/tailor/download/${id}/${encodeURIComponent(name)}`;
    return { name, url };
  });

export const buildPreviewOutputFiles = (paths: string[], id: string) =>
  paths.map((path) => {
    const name = path.split("/").slice(-1)[0];
    return {
      name,
      url: `${API_BASE}/tailor/download/${id}/${encodeURIComponent(name)}`,
      previewUrl: `${API_BASE}/tailor/preview/${id}/${encodeURIComponent(name)}`,
    };
  });
