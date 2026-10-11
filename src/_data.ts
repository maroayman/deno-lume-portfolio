export const site = {
  author: "Marwan Ayman Shawky",
  url: "https://maroayman.vercel.app",
  tagline: "Cloud & DevOps Engineer",
  description:
    "Cloud & DevOps Engineer focused on infrastructure automation, GitOps, and reliable systems.",
  navigation: [
    { label: "Home", href: "/", icon: "dock-home" },
    { label: "Experience", href: "/experience", icon: "dock-experience" },
    { label: "Projects", href: "/projects", icon: "dock-projects" },
    {
      label: "Certifications",
      href: "/certifications",
      icon: "dock-certifications",
    },
    { label: "Blog", href: "/blog", icon: "dock-blog" },
    { label: "Uses", href: "/uses", icon: "dock-uses" },
    { label: "Links", href: "/links", icon: "dock-links" },
  ],
  social: [
    { label: "Github", href: "https://github.com/maroayman" },
    { label: "LinkedIn", href: "https://linkedin.com/in/maroayman" },
    { label: "Linktree", href: "https://linktr.ee/maroayman" },
    { label: "Gitlab", href: "https://gitlab.com/maroayman" },
  ],
  contact: [
    { label: "+20 112 288 9126", href: "tel:+201122889126" },
    { label: "Cairo, Egypt", href: "https://maps.google.com/?q=Cairo+Egypt" },
    { label: "Email", href: "mailto:marwanayman.shawky@gmail.com" },
  ],
  // Availability indicator (menu bar): "open" | "selective" | "unavailable".
  // Defaults to green — Open to Work.
  availability: "open",
};

// Note: experience.yml, certifications.yml, and projects.yml are auto-loaded
// by Lume's YAML plugin. They are available in templates as:
// - `experience`
// - `certifications`
// - `projects`
// No need to import them in this file.
