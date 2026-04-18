const IMGBB_API_URL = "https://api.imgbb.com/1/upload";

export async function uploadToImgBB(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(
    `${IMGBB_API_URL}?key=${process.env.NEXT_PUBLIC_IMGBB_KEY}`,
    { method: "POST", body: formData }
  );

  if (!res.ok) {
    throw new Error("Failed to upload image to ImgBB");
  }

  const data = await res.json();
  return data.data.url;
}

export async function uploadMultipleToImgBB(files: File[]): Promise<string[]> {
  const uploads = files.map((file) => uploadToImgBB(file));
  return Promise.all(uploads);
}
