// Sort data by date (newest first) at build time

import projects from "./_data/projects.json" with { type: "json" };
import experience from "./_data/experience.json" with { type: "json" };
import certifications from "./_data/certifications.json" with { type: "json" };

// Parse date from period string (e.g., "Jun 2025 – Dec 2025" -> Dec 2025)
const parseEndDate = (period: string): Date => {
    const endPart = period.split("–").pop()?.trim() || period;
    return new Date(endPart);
};

// Parse date string (e.g., "Aug 2025" -> Date)
const parseDate = (dateStr: string): Date => {
    return new Date(dateStr);
};

// Sort projects by period (newest first)
const sortedProjects = [...projects].sort((a, b) =>
    parseInt(b.period) - parseInt(a.period)
);

// Sort experience by end date (newest first)
const sortedExperience = [...experience].sort((a, b) =>
    parseEndDate(b.period).getTime() - parseEndDate(a.period).getTime()
);

// Sort certifications by date (newest first)
const sortedCertifications = [...certifications].sort((a, b) =>
    parseDate(b.date).getTime() - parseDate(a.date).getTime()
);

export {
    sortedProjects as projects,
    sortedExperience as experience,
    sortedCertifications as certifications,
};
