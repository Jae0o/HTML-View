import type { HtmlFolder, ScannedFile } from "../types";

/** 경로를 이어 붙이는 글자 — 플랜명 / completed */
const PATH_SEPARATOR = " / ";

const HTML_EXTENSION = /\.html?$/i;

// 이름순 — 숫자는 크기순(2 가 10 보다 앞), 대소문자를 가리지 않는다
const collator = new Intl.Collator("ko", { numeric: true, sensitivity: "base" });

/** 훑지 않는 폴더 — 점(.)으로 시작하는 폴더와 의존성 폴더 */
export const isExcludedDirectory = (name: string): boolean => name.startsWith(".") || name === "node_modules";

export const isHtmlFile = (fileName: string): boolean => HTML_EXTENSION.test(fileName);

/** 찾은 파일을 폴더별로 묶는다 — HTML 이 없는 폴더는 결과에 없다 */
export const groupHtmlFiles = <THandle>(files: ScannedFile<THandle>[]): HtmlFolder<THandle>[] => {
  const byPath = new Map<string, HtmlFolder<THandle>>();

  for (const { directories, fileName, handle } of files) {
    if (!isHtmlFile(fileName)) continue;

    const path = directories.join(PATH_SEPARATOR);
    const folder = byPath.get(path) ?? { path, documents: [] };

    folder.documents.push({ name: fileName.replace(HTML_EXTENSION, ""), fileName, handle });
    byPath.set(path, folder);
  }

  return [...byPath.values()]
    .map(folder => ({
      ...folder,
      documents: folder.documents.toSorted((a, b) => collator.compare(a.fileName, b.fileName)),
    }))
    .toSorted((a, b) => collator.compare(a.path, b.path));
};
