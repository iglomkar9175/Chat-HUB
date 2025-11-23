

export async function uploadImage(file, folder = "avatars") {
  const CLOUD_NAME = "duspho9zw";            
  const PRESET = "chathub_unsigned";         

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", PRESET);
  form.append("folder", folder);

  try {
    const res = await fetch(url, {
      method: "POST",
      body: form,
    });

    if (!res.ok) {
      
      const errText = await res.text();
      console.error("Cloudinary upload error:", errText);
      throw new Error("Cloudinary upload failed");
    }

    const data = await res.json();
    return data.secure_url;  
  } catch (err) {
    console.error("UploadImage.js failed →", err);
    throw err;
  }
}
