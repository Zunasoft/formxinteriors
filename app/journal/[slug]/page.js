import { notFound } from "next/navigation";
import JournalPost from "@/components/JournalPost";
import { POSTS, IMG, imgSrc, href, plain, postBySlug } from "@/lib/journal";
import { SITE } from "@/lib/projects";

export const dynamicParams = false;

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

// the first render the post shows, for link previews
const leadImg = (p) => [p.cover, ...p.sections.map((s) => s.v)].find((v) => v.img)?.img;

export async function generateMetadata({ params }) {
  const found = postBySlug((await params).slug);
  if (!found) return {};
  const { p } = found, url = href(p), title = `${plain(p.title).replace(/\.$/, "")} | Form X Journal`, im = leadImg(p);
  return {
    title,
    description: p.dek,
    alternates: { canonical: url },
    openGraph: { type: "article", title, description: p.dek, url, ...(im ? { images: [{ url: imgSrc(im), width: IMG[im][0], height: IMG[im][1] }] } : {}) },
    twitter: { card: "summary_large_image" },
  };
}

function jsonLd(p) {
  const url = SITE + href(p), im = leadImg(p);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList", "@id": url + "#breadcrumb",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE + "/" },
          { "@type": "ListItem", position: 2, name: "Journal", item: SITE + "/journal/" },
          { "@type": "ListItem", position: 3, name: p.name, item: url },
        ],
      },
      {
        "@type": "BlogPosting", "@id": url + "#post", url, mainEntityOfPage: url,
        headline: plain(p.title), description: p.dek, articleSection: p.cat, inLanguage: "en-IN",
        isPartOf: { "@id": SITE + "/journal/#blog" },
        author: { "@id": SITE + "/#business" }, publisher: { "@id": SITE + "/#business" },
        ...(im ? { image: SITE + imgSrc(im) } : {}),
      },
    ],
  };
}

export default async function JournalPostPage({ params }) {
  const found = postBySlug((await params).slug);
  if (!found) notFound();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(found.p)) }} />
      <JournalPost key={found.p.slug} {...found} />
    </>
  );
}
