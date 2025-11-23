export async function uploadChatMedia(file) {
  const CLOUD_NAME = "duspho9zw";
  const PRESET = "chathub_unsigned";

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`;

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", PRESET);
  form.append("folder", "chat_media");

  const res = await fetch(url, { method: "POST", body: form });

  if (!res.ok) throw new Error("Cloudinary upload failed");

  const data = await res.json();
  return data.secure_url;
}
