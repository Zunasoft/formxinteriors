// Project content for the home wall, /projects/ and /projects/<slug>/.
// lib/projects.json is generated from the FigJam CONTENT board by scripts/build-projects.mjs;
// edit the board (or its export), then re-run the script. Don't hand-edit the JSON.
import data from "./projects.json";

export const SITE = "https://www.formxinteriors.com";
export const PROJECTS = data.projects;
export const ROWS = data.rows;

// Studio notes that sit between the projects on the wall.
// kind: draw (line drawing), shell (light card), fig (big figure), line (outlined card).
export const NOTES = [
  { kind: "draw", art: "light", label: "Lighting", title: "Light a room in three layers.",
    body: "Ambient to see by, task to work by, accent for depth. Plan all three before the false ceiling goes up." },
  { kind: "shell", label: "Material note", title: "Ply by zone.",
    spec: [["BWP", "Wet zones: sink, vanity"], ["MR", "Everywhere else"], ["HDHMR", "Shutters"]], body: "Ask for all three by name in your quote." },
  { kind: "fig", label: "Form X Care+", fig: ["48", "/", "48"],
    body: "48 hours to act on any service call. 48 days from drawing sign-off to handover, for a standard 3BHK." },
  { kind: "draw", art: "robe", label: "Planning", title: "Wardrobes need 600 mm.",
    body: "A hanger takes about 500. Build shallower and shirts rub against the shutters." },
  { kind: "line", label: "Before you choose", title: "See samples in your own light.",
    body: "Hold laminates by your window at noon and under your own lamps at night. Showroom lighting flatters everything." },
];

const WORDS = "zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty".split(" ");
export const word = (v) => WORDS[v] || String(v);
export const pad2 = (v) => String(v).padStart(2, "0");
export const href = (p) => `/projects/${p.slug}/`;

export function projectBySlug(slug) {
  const i = PROJECTS.findIndex((p) => p.slug === slug);
  if (i < 0) return null;
  const n = PROJECTS.length;
  return { p: PROJECTS[i], i, prev: PROJECTS[(i - 1 + n) % n], next: PROJECTS[(i + 1) % n] };
}

// "Awantika Residence" + em "Residence" -> ["Awantika ", "Residence"]
export function splitTitle(p) {
  const at = p.h1.lastIndexOf(p.em);
  return at < 0 ? [p.h1, ""] : [p.h1.slice(0, at), p.em];
}
