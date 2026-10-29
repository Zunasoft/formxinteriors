import { ART } from "@/lib/journal";

// One journal line drawing on its 400 x 240 sheet. `cls` is the page's own art class (jr-art / jp-art),
// which styles the lnf / acc / cone ... classes inside.
export default function JournalArt({ name, cls }) {
  return (
    <svg className={cls} viewBox="0 0 400 240" preserveAspectRatio="xMidYMid meet" aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: ART[name] || "" }} />
  );
}
