import currentBoardSource from "@/content/structures/2026-2027.yaml?raw";
import type {
  CmsBoardMember,
  CmsEntry,
  CmsStructure,
} from "@/lib/emdash-content";

export const currentBoardMembers = JSON.parse(
  currentBoardSource
    .replace(/^members:\s*>-\s*/, "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join(" "),
) as CmsBoardMember[];

export const currentBoard = {
  id: "2026-2027",
  slug: "2026-2027",
  data: { members: currentBoardMembers },
} satisfies CmsEntry<CmsStructure>;
