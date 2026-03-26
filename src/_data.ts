import projects from "./_data/projects.json" with { type: "json" };
import experience from "./_data/experience.json" with { type: "json" };
import certifications from "./_data/certifications.json" with { type: "json" };
import uses from "./_data/uses.json" with { type: "json" };

const toTime = (s: string): number => {
  const raw = s.split("–").pop()!.trim();
  if (/^present$/i.test(raw)) return Date.now();
  const ms = +new Date(raw);
  if (isNaN(ms)) {
    console.warn(`[_data.ts] toTime: could not parse date from "${s}" — entry will sort to the bottom.`);
    return 0;
  }
  return ms;
};

export const site = {
  author: "Marwan Ayman Shawky",
  url: "https://maroayman.vercel.app",
  tagline: "Cloud & DevOps Engineer",
};

export default {
  site,
  projects: [...projects].sort((a, b) => toTime(b.period) - toTime(a.period)),
  experience: [...experience].sort((a, b) =>
    toTime(b.period) - toTime(a.period)
  ),
  certifications: [...certifications].sort((a, b) =>
    toTime(b.date) - toTime(a.date)
  ),
  uses,
};
