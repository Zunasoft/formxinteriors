import Journal from "@/components/Journal";
import { POSTS, href, plain } from "@/lib/journal";
import { SITE } from "@/lib/projects";

const TITLE = "Interior Design Journal: Notes Before You Build | Form X Interiors";
const DESC = `${POSTS.length} short guides from Form X's Hyderabad studio on lighting, ply, wardrobes, kitchens and reading a quote. Read before you build.`;

export const metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/journal/" },
  openGraph: { title: TITLE, description: DESC, url: "/journal/", type: "website" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "@id": `${SITE}/journal/#blog`,
  url: `${SITE}/journal/`,
  name: "Form X Journal",
  description: DESC,
  inLanguage: "en-IN",
  publisher: { "@id": SITE + "/#business" },
  blogPost: POSTS.map((p) => ({ "@type": "BlogPosting", headline: plain(p.title), url: SITE + href(p) })),
};

export default function JournalPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Journal />
    </>
  );
}
