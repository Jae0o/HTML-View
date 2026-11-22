import { type DragEvent, useState } from "react";

import { type FolderMatch, useFolderStore } from "@libs/features/folder";

import { FolderRows } from "../FolderRows";

interface SortableFolderRowsProps {
  /** 보여 줄 등록 폴더 — 검색하지 않을 때는 스토어의 등록 폴더와 같은 순서 · 같은 개수다 */
  matches: FolderMatch[];
  /** 검색 중 — 일부만 보여 순서를 바꿀 수 없어 끌지 못한다. 접어 둔 폴더도 펼쳐 보여 준다 */
  isSearching: boolean;
}

// 놓을 자리 — 등록 폴더 묶음의 위 끝 · 아래 끝에 가로줄을 긋는다. 줄은 누름을 받지 않는다
const DROP_LINE_TOP_CLASS = "pointer-events-none absolute inset-x-0 top-0 z-10 h-[0.2rem] bg-brand-bg";
const DROP_LINE_BOTTOM_CLASS = "pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[0.2rem] bg-brand-bg";

/**
 * 등록 폴더 줄들 — 등록 폴더 줄을 끌어 다른 등록 폴더의 위 · 아래에 놓으면 순서가 바뀐다(기기에 기억한다).
 * 놓을 자리는 마우스가 올라간 등록 폴더 묶음(안쪽 줄 포함)의 위 절반이면 그 위, 아래 절반이면 그 아래다.
 * 검색 중에도 같은 줄을 그대로 그린다 — 검색을 지워도 접어 둔 상태가 남는다
 */
const SortableFolderRows = ({ matches, isSearching }: SortableFolderRowsProps) => {
  const moveFolder = useFolderStore(state => state.moveFolder);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  // 놓을 자리 — 0 이면 맨 위, 등록 폴더 개수면 맨 아래
  const [dropIndex, setDropIndex] = useState<number | null>(null);

  const fromIndex = matches.findIndex(({ folder }) => folder.id === draggingId);
  // 끈 폴더의 바로 위 · 아래는 제자리라 표시하지 않고, 놓아도 옮기지 않는다
  const targetIndex =
    fromIndex !== -1 && dropIndex !== null && dropIndex !== fromIndex && dropIndex !== fromIndex + 1 ? dropIndex : null;

  const reset = () => {
    setDraggingId(null);
    setDropIndex(null);
  };

  const handleDragStart = (e: DragEvent<HTMLDivElement>, id: string) => {
    e.dataTransfer.effectAllowed = "move";
    setDraggingId(id);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>, index: number) => {
    // 등록 폴더를 끌 때만 받는다 — 바깥에서 끌어 온 파일 · 글자는 받지 않는다
    if (draggingId === null) return;

    e.preventDefault();
    e.dataTransfer.dropEffect = "move";

    const rect = e.currentTarget.getBoundingClientRect();
    setDropIndex(e.clientY < rect.top + rect.height / 2 ? index : index + 1);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    // 놓을 자리는 옮기기 전 목록 기준이다 — 끈 폴더보다 아래면 끈 폴더가 빠진 만큼 한 칸 당긴다
    if (draggingId !== null && targetIndex !== null) {
      moveFolder(draggingId, targetIndex > fromIndex ? targetIndex - 1 : targetIndex);
    }
    reset();
  };

  // 목록 밖으로 나가면 놓을 자리 표시를 지운다 — 안쪽 줄 사이를 옮겨 다니는 것은 나간 것이 아니다
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    if (!(e.relatedTarget instanceof Node && e.currentTarget.contains(e.relatedTarget))) setDropIndex(null);
  };

  return (
    <div onDragLeave={handleDragLeave}>
      {matches.map(({ folder, documentMatchedPaths }, index) => (
        <div
          key={folder.id}
          className="relative"
          onDragOver={e => handleDragOver(e, index)}
          onDrop={handleDrop}
        >
          {targetIndex === index && <span className={DROP_LINE_TOP_CLASS} />}
          <FolderRows
            folder={folder}
            forceExpanded={isSearching}
            forceExpandedPaths={documentMatchedPaths}
            onDragStart={isSearching ? undefined : e => handleDragStart(e, folder.id)}
            onDragEnd={reset}
          />
          {targetIndex === matches.length && index === matches.length - 1 && (
            <span className={DROP_LINE_BOTTOM_CLASS} />
          )}
        </div>
      ))}
    </div>
  );
};

export default SortableFolderRows;
