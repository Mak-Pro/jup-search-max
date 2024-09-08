import { GTagEvent } from "@/Types";

export async function getData(url: string, revalidate?: number) {
  try {
    const res = await fetch(url, {
      next: { revalidate: revalidate ? revalidate : 60 },
    });
    if (!res.ok) {
      throw new Error("Failed to fetch Data");
    }
    return res.json();
  } catch (error: any) {
    console.log(error.message);
  }
}

export const readFile = (file: File) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result), false);
    reader.readAsDataURL(file);
  });
};

export function numberFormatter(val: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(val);
}

export function numberFormatterSimple(val: number) {
  return new Intl.NumberFormat("en-US").format(val);
}

export const timeFormatter = (timeInSeconds: number) => {
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${hours.toString().padStart(2, "0")}h ${minutes
    .toString()
    .padStart(2, "0")}m`;
};

export function priceFormatter(val: string | number) {
  if (String(val).length > 9) {
    const start = `${String(val).split(".").shift()}.0`;
    const end = String(val).split(".0").pop();
    let zeros = 0;
    for (let i = 0; i < end!.length; i++) {
      if (end![i] === "0") {
        zeros += 1;
      } else {
        break;
      }
    }
    let nonZeros = String(val).slice(start.length + zeros);
    if (zeros > 1) {
      return `${start}<span>${zeros}</span>${nonZeros}`;
    } else {
      return parseFloat(String(val)).toFixed(6);
    }
  } else {
    return val;
  }
}

export const gtagEvent = ({ action, category, label, value }: GTagEvent) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

export function checkImageFileType(target: string, pattern: string[]) {
  let value = 0;
  pattern.forEach(function (word) {
    value = value + +target.includes(word);
  });
  return value === 1;
}

export const hideText = (value: string | number, symbol: string) => {
  return "".padStart(String(value).length, symbol);
};
