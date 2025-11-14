import cloudinary from "./cloudinaryConfig";

export interface CloudinaryUploadOptions {
  folder: string;
  resourceType?: "image" | "raw" | "video" | "auto";
}

export interface CloudinaryUploadResult {
  url: string;
}

/**
 * Uploads a file to Cloudinary
 * @param filePath - Local path to the file
 * @param options - Upload options (folder and resource type)
 * @returns Object containing the secure URL of the uploaded file
 */
export async function uploadToCloudinary(
  filePath: string,
  options: CloudinaryUploadOptions
): Promise<CloudinaryUploadResult> {
  const { folder, resourceType = "auto" } = options;

  const result = await cloudinary.uploader.upload(filePath, {
    folder,
    resource_type: resourceType,
  });

  return { url: result.secure_url };
}
