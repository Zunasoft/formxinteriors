import { notFound } from "next/navigation";
import ProjectView from "@/components/ProjectView";
import { PROJECTS, SITE, href, projectBySlug } from "@/lib/projects";

export const dynamicParams = false;

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const found = projectBySlug((await params).slug);
  if (!found) return {};
  const { p } = found, og = p.images[p.og], url = href(p);
  return {
    title: p.title,
    description: p.meta,
    keywords: p.keywords,
    alternates: { canonical: url },
    openGraph: { type: "article", title: p.title, description: p.meta, url, images: [{ url: og.src, width: og.w, height: og.h, alt: og.alt }] },
    twitter: { card: "summary_large_image" },
  };
}

function jsonLd(p) {
  const url = SITE + href(p);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage", "@id": url + "#webpage", url, name: p.title, description: p.meta, inLanguage: "en-IN",
        isPartOf: { "@id": SITE + "/#website" },
        breadcrumb: { "@id": url + "#breadcrumb" },
        mainEntity: { "@id": url + "#project" },
        primaryImageOfPage: { "@id": url + "#lead" },
      },
      {
        "@type": "BreadcrumbList", "@id": url + "#breadcrumb",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE + "/" },
          { "@type": "ListItem", position: 2, name: "Projects", item: SITE + "/projects/" },
          { "@type": "ListItem", position: 3, name: p.name, item: url },
        ],
      },
      {
        "@type": "CreativeWork", "@id": url + "#project", name: p.name, description: p.brief,
        genre: `${p.cat} interior design`, keywords: p.keywords.join(", "),
        creator: { "@id": SITE + "/#business" }, inLanguage: "en-IN",
        locationCreated: {
          "@type": "Place", name: p.where,
          address: { "@type": "PostalAddress", addressLocality: "Hyderabad", addressRegion: "Telangana", addressCountry: "IN" },
        },
        image: p.images.map((im, i) => ({
          "@type": "ImageObject", contentUrl: SITE + im.src, caption: im.alt, ...(i === p.lead ? { "@id": url + "#lead" } : {}),
        })),
      },
    ],
  };
}

export default async function ProjectPage({ params }) {
  const found = projectBySlug((await params).slug);
  if (!found) notFound();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(found.p)) }} />
      <ProjectView key={found.p.slug} {...found} />
    </>
  );
}
