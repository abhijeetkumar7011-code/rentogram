import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabaseAdmin";

// POST /api/products/upload-image
// FormData fields:
//   file        — the image file (compress client-side first, see lib/imageCompress.js)
//   productId   — uuid of the product this image belongs to
//   isPrimary   — "true" | "false" (optional, defaults to false)
//   position    — integer sort order (optional, defaults to 0)
//
// This route runs entirely server-side, so it's the only thing allowed to
// write to the `products` Storage bucket / product_images table — the
// service_role key never reaches the browser. Once an admin auth system
// exists, add a session check here before allowing the upload.
export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const productId = formData.get("productId");
    const isPrimary = formData.get("isPrimary") === "true";
    const position = parseInt(formData.get("position") || "0", 10);

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (!productId) {
      return NextResponse.json({ error: "productId is required" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const ext = (file.name?.split(".").pop() || "jpg").toLowerCase();
    const path = `${productId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from("products")
      .upload(path, buffer, { contentType: file.type || "image/jpeg", upsert: false });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }

    const { data: publicUrlData } = supabaseAdmin.storage.from("products").getPublicUrl(path);
    const imageUrl = publicUrlData.publicUrl;

    if (isPrimary) {
      // unset any existing primary image for this product first
      await supabaseAdmin.from("product_images").update({ is_primary: false }).eq("product_id", productId);
    }

    const { data: row, error: dbError } = await supabaseAdmin
      .from("product_images")
      .insert([{ product_id: productId, image_url: imageUrl, position, is_primary: isPrimary }])
      .select()
      .single();

    if (dbError) {
      console.error("product_images insert error:", dbError);
      return NextResponse.json({ error: "Could not save image record" }, { status: 500 });
    }

    if (isPrimary) {
      await supabaseAdmin.from("products").update({ image_url: imageUrl }).eq("id", productId);
    }

    return NextResponse.json({ image: row }, { status: 201 });
  } catch (err) {
    console.error("upload-image route error:", err);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}

// DELETE /api/products/upload-image?id=<product_images.id>&path=<storage-path>
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const path = searchParams.get("path");

    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

    if (path) {
      const { error: storageError } = await supabaseAdmin.storage.from("products").remove([path]);
      if (storageError) console.error("Storage delete error:", storageError);
    }

    const { error } = await supabaseAdmin.from("product_images").delete().eq("id", id);
    if (error) {
      console.error("product_images delete error:", error);
      return NextResponse.json({ error: "Delete failed" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("upload-image DELETE error:", err);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}