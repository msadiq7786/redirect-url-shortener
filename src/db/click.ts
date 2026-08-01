import { UAParser } from "ua-parser-js";
import { supabase } from "./supabase";

// Get CLick
export async function getUrlsClick(url_ids: string[]) {
  const { data, error } = await supabase
    .from("clicks")
    .select("*")
    .in("url_id", url_ids);

  if (error) {
    console.error(error.message);
    throw new Error("Unable to fetch clicks");
  }

  return data;
}

const parser = new UAParser();

export async function storeClicks({
  id,
  originalUrl,
}: {
  id: string;
  originalUrl: string;
}) {
  try {
    const result = parser.getResult();
    const device = result.device.type || "desktop";

    const response = await fetch("https://ipapi.co/json");
    const { country_name: country, city } = await response.json();

    await supabase.from("clicks").insert({
      url_id: id,
      device,
      country,
      city,
    });

    window.location.href = originalUrl;
  } catch (error) {
    console.error("Unable to redirect", error);
  }
}

export async function getClicksUrl(urlId: string) {
  const { data, error } = await supabase
    .from("clicks")
    .select("*")
    .eq("url_id", urlId);

  if (error) {
    console.error(error.message);
    throw new Error("Unable to fetch stats");
  }

  return data;
}
