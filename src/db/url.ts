import { supabase, supabaseUrl } from "./supabase";

// Get Urls
export async function getUrls(user_id: string) {
  const { data, error } = await supabase
    .from("urls")
    .select("*")
    .eq("user_id", user_id);

  if (error) {
    console.error(error.message);
    throw new Error("Unable to fetch urls");
  }

  return data;
}

// Delete Url
export async function deleteUrl(id: string) {
  const { data, error } = await supabase.from("urls").delete().eq("id", id);
  if (error) {
    console.error(error.message);
    throw new Error("Unable to fetch urls");
  }

  return data;
}
// Delete Url
type Deleteparams = {
  title: string;
  originalUrl: string;
  customUrl: string;
  userId: string;
};
export async function createUrl(
  { title, originalUrl, customUrl, userId }: Deleteparams,
  qrcode: any,
) {
  const shortUrl = Math.random().toString(36).substring(2, 8);
  const fileName = `qr-${shortUrl}`;
  const { error: storageError } = await supabase.storage
    .from("qr-code")
    .upload(fileName, qrcode);

  if (storageError) {
    throw new Error(storageError.message);
  }

  const qr = `${supabaseUrl}/storage/v1/object/public/qr-code/${fileName}`;

  const { data, error } = await supabase
    .from("urls")
    .insert([
      {
        title,
        user_id: userId,
        original_url: originalUrl,
        short_url: customUrl ? customUrl : shortUrl,
        custom_url: customUrl || null,
        qr,
      },
    ])
    .select();

  if (error) {
    console.error(error.message);
    throw new Error(error.message || "Unable to create url");
  }

  return data;
}

export async function getRedirectUrl(id: string) {
  const { data, error } = await supabase
    .from("urls")
    .select("id,original_url")
    .or(`short_url.eq.${id},custom_url.eq.${id}`)
    .single();

  if (error) {
    console.error(error.message);
    throw new Error("Unable to fetch shorturl");
  }

  return data;
}

export async function getUrl({ id, userId }: { id: string; userId: string }) {
  const { data, error } = await supabase
    .from("urls")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error(error.message);
    throw new Error("ShortUrl not found");
  }

  return data;
}
