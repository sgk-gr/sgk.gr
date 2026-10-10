import { supabaseAutopsia } from "./supabase";

export function compressImageForUpload(file: File | Blob): Promise<Blob | File> {
  return new Promise((resolve) => {
    const isImage = (file.type && file.type.startsWith("image/")) || 
      (file instanceof File && /\.(jpg|jpeg|png|webp|heic)$/i.test(file.name));

    if (!isImage) {
      return resolve(file);
    }

    if (file.size && file.size < 250 * 1024) {
      return resolve(file);
    }

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 1600;
          const MAX_HEIGHT = 1600;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round(height * (MAX_WIDTH / width));
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round(width * (MAX_HEIGHT / height));
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) return resolve(file);

          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => {
            if (blob && blob.size < file.size) {
              resolve(blob);
            } else {
              resolve(file);
            }
          }, "image/jpeg", 0.78);
        };
        img.onerror = () => resolve(file);
      };
      reader.onerror = () => resolve(file);
    } catch {
      resolve(file);
    }
  });
}

export async function uploadToR2(rawFile: File | Blob, fileName: string): Promise<string | null> {
  try {
    const isImage = (rawFile.type && rawFile.type.startsWith("image/")) || 
      /\.(jpg|jpeg|png|webp|heic)$/i.test(fileName);
      
    const file = isImage ? await compressImageForUpload(rawFile) : rawFile;
    const contentType = isImage ? "image/jpeg" : (file.type || "application/octet-stream");

    const { data: signData, error: signError } = await supabaseAutopsia.functions.invoke("r2-sign-upload", {
      body: { fileName, contentType },
    });

    if (signError || !signData?.uploadUrl) {
      console.error("Error getting pre-signed URL:", signError);
      throw new Error("Could not get upload URL");
    }

    const { uploadUrl } = signData;

    const uploadRes = await fetch(uploadUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": contentType,
      },
    });

    if (!uploadRes.ok) {
      const errorText = await uploadRes.text();
      console.error("R2 Upload failed:", errorText);
      throw new Error(`Upload failed: ${uploadRes.statusText}`);
    }

    const publicBaseUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "https://pub-c08b1610623748bfb2c633b2c4e31130.r2.dev";
    return `${publicBaseUrl.replace(/\/$/, "")}/${fileName}`;
  } catch (error) {
    console.error("uploadToR2 Error:", error);
    return null;
  }
}

export async function deleteFromR2(fileName: string): Promise<boolean> {
  try {
    const { error } = await supabaseAutopsia.functions.invoke("r2-delete-file", {
      body: { fileName },
    });

    if (error) {
      console.error("Error deleting from R2:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("deleteFromR2 Error:", error);
    return false;
  }
}
