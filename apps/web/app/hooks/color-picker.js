import { useMemo } from "react";

const tailwindColors = [
  "zinc",
  "neutral",
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
];

const shades = [100, 200, 300, 400, 500, 600, 700];

// A larger set of Tailwind color mappings for RGB values
const tailwindColorRGB = {
  "red-500": { r: 239, g: 68, b: 68 },
  "red-600": { r: 220, g: 38, b: 38 },
  "red-700": { r: 185, g: 28, b: 28 },
  "red-800": { r: 153, g: 27, b: 27 },
  "red-900": { r: 127, g: 29, b: 29 },
  "blue-500": { r: 59, g: 130, b: 246 },
  "blue-600": { r: 37, g: 99, b: 235 },
  "blue-700": { r: 29, g: 78, b: 216 },
  "blue-800": { r: 30, g: 64, b: 175 },
  "blue-900": { r: 30, g: 58, b: 138 },
  "yellow-500": { r: 234, g: 179, b: 8 },
  "yellow-600": { r: 202, g: 138, b: 4 },
  "yellow-700": { r: 161, g: 98, b: 7 },
  "yellow-800": { r: 133, g: 77, b: 14 },
  "yellow-900": { r: 113, g: 63, b: 18 },
  "zinc-500": { r: 113, g: 113, b: 122 },
  "zinc-600": { r: 82, g: 82, b: 91 },
  "zinc-700": { r: 63, g: 63, b: 70 },
  "zinc-800": { r: 39, g: 39, b: 42 },
  "zinc-900": { r: 24, g: 24, b: 27 },
  "neutral-500": { r: 115, g: 115, b: 115 },
  "neutral-600": { r: 82, g: 82, b: 82 },
  "neutral-700": { r: 64, g: 64, b: 64 },
  "neutral-800": { r: 38, g: 38, b: 38 },
  "neutral-900": { r: 23, g: 23, b: 23 },
  "green-500": { r: 34, g: 197, b: 94 },
  "green-600": { r: 22, g: 163, b: 74 },
  "green-700": { r: 21, g: 128, b: 61 },
  "green-800": { r: 22, g: 101, b: 52 },
  "green-900": { r: 20, g: 83, b: 45 },
  "emerald-500": { r: 16, g: 185, b: 129 },
  "emerald-600": { r: 5, g: 150, b: 105 },
  "emerald-700": { r: 4, g: 120, b: 87 },
  "emerald-800": { r: 6, g: 95, b: 70 },
  "emerald-900": { r: 6, g: 78, b: 59 },
  "teal-500": { r: 20, g: 184, b: 166 },
  "teal-600": { r: 13, g: 148, b: 136 },
  "teal-700": { r: 15, g: 118, b: 110 },
  "teal-800": { r: 17, g: 94, b: 89 },
  "teal-900": { r: 19, g: 78, b: 74 },
  "cyan-500": { r: 6, g: 182, b: 212 },
  "cyan-600": { r: 8, g: 145, b: 178 },
  "cyan-700": { r: 14, g: 116, b: 144 },
  "cyan-800": { r: 21, g: 94, b: 117 },
  "cyan-900": { r: 22, g: 78, b: 99 },
  "sky-500": { r: 14, g: 165, b: 233 },
  "sky-600": { r: 2, g: 132, b: 199 },
  "sky-700": { r: 3, g: 105, b: 161 },
  "sky-800": { r: 7, g: 89, b: 133 },
  "sky-900": { r: 12, g: 74, b: 110 },
  "indigo-500": { r: 99, g: 102, b: 241 },
  "indigo-600": { r: 79, g: 70, b: 229 },
  "indigo-700": { r: 67, g: 56, b: 202 },
  "indigo-800": { r: 55, g: 48, b: 163 },
  "indigo-900": { r: 49, g: 46, b: 129 },
  "violet-500": { r: 139, g: 92, b: 246 },
  "violet-600": { r: 124, g: 58, b: 237 },
  "violet-700": { r: 109, g: 40, b: 217 },
  "violet-800": { r: 91, g: 33, b: 182 },
  "violet-900": { r: 76, g: 29, b: 149 },
  "purple-500": { r: 168, g: 85, b: 247 },
  "purple-600": { r: 147, g: 51, b: 234 },
  "purple-700": { r: 126, g: 34, b: 206 },
  "purple-800": { r: 107, g: 33, b: 168 },
  "purple-900": { r: 88, g: 28, b: 135 },
  "fuchsia-500": { r: 217, g: 70, b: 239 },
  "fuchsia-600": { r: 192, g: 38, b: 211 },
  "fuchsia-700": { r: 162, g: 28, b: 175 },
  "fuchsia-800": { r: 134, g: 25, b: 143 },
  "fuchsia-900": { r: 112, g: 26, b: 117 },
  "pink-500": { r: 236, g: 72, b: 153 },
  "pink-600": { r: 219, g: 39, b: 119 },
  "pink-700": { r: 190, g: 24, b: 93 },
  "pink-800": { r: 157, g: 23, b: 77 },
  "pink-900": { r: 131, g: 24, b: 67 },
  "rose-500": { r: 244, g: 63, b: 94 },
  "rose-600": { r: 225, g: 29, b: 72 },
  "rose-700": { r: 190, g: 18, b: 60 },
  "rose-800": { r: 159, g: 18, b: 57 },
  "rose-900": { r: 136, g: 19, b: 55 },
  "orange-500": { r: 249, g: 115, b: 22 },
  "orange-600": { r: 234, g: 88, b: 12 },
  "orange-700": { r: 194, g: 65, b: 12 },
  "orange-800": { r: 154, g: 52, b: 18 },
  "orange-900": { r: 124, g: 45, b: 18 },
  "amber-500": { r: 245, g: 158, b: 11 },
  "amber-600": { r: 217, g: 119, b: 6 },
  "amber-700": { r: 180, g: 83, b: 9 },
  "amber-800": { r: 146, g: 64, b: 14 },
  "amber-900": { r: 120, g: 53, b: 15 },
  "lime-500": { r: 132, g: 204, b: 22 },
  "lime-600": { r: 101, g: 163, b: 13 },
  "lime-700": { r: 77, g: 124, b: 15 },
  "lime-800": { r: 63, g: 98, b: 18 },
  "lime-900": { r: 54, g: 83, b: 20 },
};

const stringToHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

const getLuminance = (color) => {
  const { r, g, b } = color;
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

const getRandomTailwindColorFromString = (str) => {
  const hash = stringToHash(str);
  const colorIndex = Math.abs(hash) % tailwindColors.length;
  const color = tailwindColors[colorIndex];

  const shadeIndex = Math.abs(hash) % shades.length;
  const shade = shades[shadeIndex];

  return `${color}-${shade}`;
};

const getTextColor = (backgroundColor) => {
  const rgb = tailwindColorRGB[backgroundColor];
  if (!rgb) return "text-black"; // Default to white if no mapping exists

  const luminance = getLuminance(rgb);
  return luminance < 0.5 ? "text-white" : "text-black";
};

export const userColorPicker = (string) => {
  const backgroundColor = useMemo(
    () => getRandomTailwindColorFromString(string),
    [string]
  );
  const textColor = useMemo(
    () => getTextColor(backgroundColor),
    [backgroundColor]
  );

  return { backgroundColor, textColor };
};
