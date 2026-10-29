import Projects from "@/components/Projects";
import { PROJECTS, SITE, href } from "@/lib/projects";

const TITLE = "Interior Design Projects in Hyderabad | Form X Interiors";
const DESC = `${PROJECTS.length} villas, apartments and offices designed and built by Form X's architects across Hyderabad. Open any project to see the idea behind it.`;

export const metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/projects/" },
  openGraph: { title: TITLE, description: DESC, url: "/projects/", type: "website" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${SITE}/projects/#webpage`,
  url: `${SITE}/projects/`,
  name: TITLE,
  description: DESC,
  inLanguage: "en-IN",
  mainEntity: {
    "@type": "ItemList",
    itemListElement: PROJECTS.map((p, i) => ({ "@type": "ListItem", position: i + 1, name: p.name, url: SITE + href(p) })),
  },
};

export default function ProjectsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Projects page />
    </>
  );
}
