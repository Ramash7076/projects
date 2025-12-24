import cloudinary from "@/lib/cloudinary";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("images");

    if (!files.length) {
      return Response.json({ error: "No images uploaded" }, { status: 400 });
    }

    const uploadedImages = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "products",
              resource_type: "image",
            },
            (err, res) => {
              if (err) reject(err);
              else resolve(res);
            }
          )
          .end(buffer);
      });

      uploadedImages.push({
        url: result.secure_url,
        public_id: result.public_id,
      });
    }

    return Response.json({ images: uploadedImages });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Upload failed" }, { status: 500 });
  }
}
