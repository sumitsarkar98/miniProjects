import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises"; // Use fs.promises for async file operations

// Check if environment variables are set
if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  throw new Error("Cloudinary environment variables are missing!");
}

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload a file
export const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // Upload file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log("File uploaded to Cloudinary successfully!!", response.url);

    // Delete local file after successful upload
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    console.error("Cloudinary upload error:", error.message);

    // Remove the file safely if it exists
    try {
      fs.unlinkSync(localFilePath);
    } catch (unlinkError) {
      console.warn("Failed to delete local file:", unlinkError.message);
    }

    return null;
  }
};

/*
  // Upload an image
  const uploadResult = await cloudinary.uploader
    .upload(
      "https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg",
      {
        public_id: "shoes",
      }
    )
    .catch((error) => {
      console.log(error);
    });

  console.log(uploadResult);

  // Optimize delivery by resizing and applying auto-format and auto-quality
  const optimizeUrl = cloudinary.url("shoes", {
    fetch_format: "auto",
    quality: "auto",
  });

  console.log(optimizeUrl);

  // Transform the image: auto-crop to square aspect_ratio
  const autoCropUrl = cloudinary.url("shoes", {
    crop: "auto",
    gravity: "auto",
    width: 500,
    height: 500,
  });

  console.log(autoCropUrl);
})();
*/
