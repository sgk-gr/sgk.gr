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

    const formData = new FormData();
    formData.append("file", file, fileName);
    formData.append("fileName", fileName);

    const res = await fetch("/api/autopsia/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok || !data?.url) {
      console.warn("R2 upload notice:", data?.error);
      if (rawFile instanceof Blob) {
        return URL.createObjectURL(rawFile);
      }
      return null;
    }

    return data.url;
  } catch (error) {
    console.error("uploadToR2 Error:", error);
    if (rawFile instanceof Blob) {
      return URL.createObjectURL(rawFile);
    }
    return null;
  }
}

export async function deleteFromR2(fileName: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/autopsia/r2-sign-upload?fileName=${encodeURIComponent(fileName)}`, {
      method: "DELETE",
    });
    return res.ok;
  } catch (error) {
    console.error("deleteFromR2 Error:", error);
    return false;
  }
}
