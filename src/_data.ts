import projects from "./_data/projects.json" with { type: "json" };
import experience from "./_data/experience.json" with { type: "json" };
import certifications from "./_data/certifications.json" with { type: "json" };

const toTime = (s: string) => +new Date(s.split("–").pop()!.trim()) || 0;

export default {
    projects: [...projects].sort((a, b) => toTime(b.period) - toTime(a.period)),
    experience: [...experience].sort((a, b) => toTime(b.period) - toTime(a.period)),
    certifications: [...certifications].sort((a, b) => toTime(b.date) - toTime(a.date)),
};
