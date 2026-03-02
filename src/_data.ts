import projects from "./_data/projects.json" with { type: "json" };
import experience from "./_data/experience.json" with { type: "json" };
import certifications from "./_data/certifications.json" with { type: "json" };

const toTime = (s: string): number => {
  const raw = s.split("–").pop()!.trim();
  const ms = +new Date(raw);
  if (isNaN(ms)) {
    console.warn(`[_data.ts] toTime: could not parse date from "${s}" — entry will sort to the bottom.`);
    return 0;
  }
  return ms;
};

export default {
  projects: [...projects].sort((a, b) => toTime(b.period) - toTime(a.period)),
  experience: [...experience].sort((a, b) =>
    toTime(b.period) - toTime(a.period)
  ),
  certifications: [...certifications].sort((a, b) =>
    toTime(b.date) - toTime(a.date)
  ),
};
