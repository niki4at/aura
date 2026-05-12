import { NextResponse } from "next/server";
import { computeClimateFlags } from "@/lib/engine";
import type { ClimateContext } from "@/lib/types";

export const runtime = "edge";

interface GeoResult {
  latitude: number;
  longitude: number;
  name: string;
  country: string;
  country_code: string;
}

async function geocode(city: string): Promise<GeoResult | null> {
  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.set("name", city);
  url.searchParams.set("count", "1");
  url.searchParams.set("language", "en");
  url.searchParams.set("format", "json");
  const res = await fetch(url, { next: { revalidate: 86400 } });
  if (!res.ok) return null;
  const data = (await res.json()) as { results?: GeoResult[] };
  return data.results?.[0] ?? null;
}

async function fetchWeather(lat: number, lon: number) {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lon));
  url.searchParams.set(
    "current",
    "temperature_2m,relative_humidity_2m,weather_code,uv_index",
  );
  url.searchParams.set("timezone", "auto");
  const res = await fetch(url, { next: { revalidate: 1800 } });
  if (!res.ok) throw new Error("weather request failed");
  return (await res.json()) as {
    current: {
      temperature_2m: number;
      relative_humidity_2m: number;
      weather_code: number;
      uv_index: number;
    };
  };
}

async function fetchAirQuality(lat: number, lon: number) {
  try {
    const url = new URL("https://air-quality-api.open-meteo.com/v1/air-quality");
    url.searchParams.set("latitude", String(lat));
    url.searchParams.set("longitude", String(lon));
    url.searchParams.set("current", "european_aqi,us_aqi,pm10,pm2_5");
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      current?: { european_aqi?: number; us_aqi?: number; pm2_5?: number };
    };
    return data.current?.european_aqi ?? data.current?.us_aqi ?? null;
  } catch {
    return null;
  }
}

const codeToCondition: Record<number, string> = {
  0: "Clear",
  1: "Mostly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Foggy",
  48: "Foggy",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Heavy drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  71: "Light snow",
  73: "Snow",
  75: "Heavy snow",
  80: "Showers",
  81: "Heavy showers",
  82: "Violent showers",
  95: "Thunderstorm",
  96: "Storm w/ hail",
  99: "Severe storm",
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const cityParam = url.searchParams.get("city");
  const latParam = url.searchParams.get("lat");
  const lonParam = url.searchParams.get("lon");

  let lat: number | null = null;
  let lon: number | null = null;
  let city: string | undefined;
  let country: string | undefined;
  let countryCode: string | undefined;

  try {
    if (latParam && lonParam) {
      lat = parseFloat(latParam);
      lon = parseFloat(lonParam);
    } else if (cityParam) {
      const geo = await geocode(cityParam);
      if (geo) {
        lat = geo.latitude;
        lon = geo.longitude;
        city = geo.name;
        country = geo.country;
        countryCode = geo.country_code;
      }
    }

    if (lat == null || lon == null) {
      return NextResponse.json(
        { error: "missing location" },
        { status: 400 },
      );
    }

    const [weather, aqi] = await Promise.all([
      fetchWeather(lat, lon),
      fetchAirQuality(lat, lon),
    ]);

    const climate: ClimateContext = computeClimateFlags({
      temperatureC: weather.current.temperature_2m ?? null,
      humidity: weather.current.relative_humidity_2m ?? null,
      uvIndex: weather.current.uv_index ?? null,
      airQuality: aqi,
      condition: codeToCondition[weather.current.weather_code] ?? "Mild",
      isDry: false,
      isHumid: false,
      isCold: false,
      isHot: false,
      isHighUv: false,
      isPolluted: false,
      source: "live",
    });

    return NextResponse.json({ ...climate, city, country, countryCode });
  } catch {
    return NextResponse.json({ error: "climate failed" }, { status: 500 });
  }
}
