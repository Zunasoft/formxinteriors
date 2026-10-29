// Builds the project data and images from the FigJam CONTENT board export.
//
//   node scripts/build-projects.mjs [path/to/formx-projects.json] [path/to/CONTENT]
//
// Source of truth is the board (exported as formx-projects.json). This writes
//   lib/projects.json                                   — what the site reads
//   public/images/projects/<slug>/<drive-name>.webp     — 1600 px wide
//   public/images/projects/<slug>/<drive-name>-800.webp — 800 px wide (srcset)
// Images that already exist are skipped, so re-running after a copy edit is fast.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const SRC_JSON = path.resolve(process.argv[2] || path.join(root, "../006-BLOG _ MORE PROJECT _ PROJECT DETAILS/formx-seo-handoff/formx-projects.json"));
const SRC_IMG = path.resolve(process.argv[3] || path.join(root, "../CONTENT"));
const OUT_IMG = path.join(root, "public/images/projects");

// Gallery rows, left to right (from the board's gallery plan). p = project, n = studio note,
// cta = consultation box; ":2" makes a box two columns wide.
const ROWS = [
  ["p0", "p1", "p2", "n0", "p5:2", "p9", "n2", "p13:2", "p14", "p10", "cta"],
  ["p3:2", "p4", "n1", "p6", "p7:2", "n3", "p8", "p11", "n4", "p12", "p15"],
];

const board = JSON.parse(fs.readFileSync(SRC_JSON, "utf8"));

// Drive file name -> full path, across every project folder
const files = new Map();
for (const dir of fs.readdirSync(SRC_IMG, { withFileTypes: true })) {
  if (!dir.isDirectory()) continue;
  for (const f of fs.readdirSync(path.join(SRC_IMG, dir.name))) files.set(f, path.join(SRC_IMG, dir.name, f));
}


async function image(slug, file) {
  const src = files.get(file);
  if (!src) throw new Error(`${slug}: ${file} is not in ${SRC_IMG}`);
  const base = file.replace(/\.[a-z]+$/i, "");
  const dir = path.join(OUT_IMG, slug);
  fs.mkdirSync(dir, { recursive: true });
  const big = path.join(dir, base + ".webp"), small = path.join(dir, base + "-800.webp");
  if (!fs.existsSync(big)) await sharp(src).rotate().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 80 }).toFile(big);
  if (!fs.existsSync(small)) await sharp(src).rotate().resize({ width: 800, withoutEnlargement: true }).webp({ quality: 78 }).toFile(small);
  const { width, height } = await sharp(big).metadata();
  const url = `/images/projects/${slug}/${base}`;
  return { src: url + ".webp", sm: url + "-800.webp", w: width, h: height };
}

const projects = [];
for (const p of board) {
  const images = [];
  for (const im of p.images) images.push({ ...(await image(p.slug, im.file)), alt: im.alt, n: im.n });
  const at = (frame) => Math.max(0, images.findIndex((im) => im.n === frame));
  const lead = at(p.lead_frame);
  projects.push({
    num: p.num,
    slug: p.slug,
    name: p.name,
    h1: p.h1.replace(/\.$/, ""),
    em: p.em,
    sub: p.sub,
    where: p.locality,
    loc: p.locality.split(",")[0],
    cat: p.category,
    space: p.space,
    idea: p.idea,
    brief: p.brief,
    title: p.title,
    meta: p.meta,
    keywords: [p.primary_keyword, ...p.supporting_keywords.split(" · ")].filter(Boolean),
    lead,
    og: at(p.og_frame),
    // the first stop is the overview of the lead render; each stop shows its own frame
    tour: p.tour.map((t) => ({ label: t.label, line: t.line, img: at(t.frame) })),
    images: images.map(({ n, ...im }) => im),
  });
  process.stdout.write(`${p.num} ${p.slug}: ${images.length} images\n`);
}

fs.writeFileSync(path.join(root, "lib/projects.json"), JSON.stringify({ rows: ROWS, projects }, null, 1) + "\n");
console.log(`lib/projects.json: ${projects.length} projects`);
