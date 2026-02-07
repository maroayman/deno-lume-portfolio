/**
 * Type definitions for portfolio data structures
 * These interfaces provide type safety for JSON data files
 */

/**
 * Work experience entry
 */
export interface Experience {
  title: string;
  company: string;
  period: string;
  description: string;
  responsibilities: string[];
  tags: string[];
}

/**
 * Project entry
 */
export interface Project {
  title: string;
  period: string;
  summary: string;
  highlights: string[];
  tags: string[];
  github?: string;
}

/**
 * Certification entry
 */
export interface Certification {
  title: string;
  issuer: string;
  date: string;
  credential?: string;
  badge: string;
}

/**
 * Blog post frontmatter data
 */
export interface BlogPost {
  title: string;
  description: string;
  date: Date;
  tags?: string[];
  cover?: string;
  featured?: boolean;
  url: string;
  content: string;
}

/**
 * Site configuration data
 */
export interface SiteData {
  experience: Experience[];
  projects: Project[];
  certifications: Certification[];
}

/**
 * Social share platform configuration
 */
export interface SharePlatform {
  name: string;
  url: string;
  icon: string;
}

/**
 * Structured data types for Schema.org
 */
export interface SchemaPerson {
  "@type": "Person";
  name: string;
  url: string;
  jobTitle?: string;
  sameAs?: string[];
}

export interface SchemaBlogPosting {
  "@context": "https://schema.org";
  "@type": "BlogPosting";
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified: string;
  author: SchemaPerson;
  publisher: SchemaPerson;
  image?: string;
  keywords?: string;
}

export interface SchemaWebSite {
  "@context": "https://schema.org";
  "@type": "WebSite";
  name: string;
  url: string;
  description: string;
}
