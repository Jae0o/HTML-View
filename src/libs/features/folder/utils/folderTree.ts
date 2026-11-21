import type { DocumentEntry, DocumentLocation, FolderMatch, HtmlFolder, RegisteredFolder, ScannedFile } from "../types";

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

/** 자리로 문서를 찾는다 — 폴더가 없거나 연결이 끊겼거나 문서가 없어졌으면 undefined */
export const findDocument = (
  folders: RegisteredFolder[],
  { folderId, path, fileName }: DocumentLocation,
): DocumentEntry | undefined =>
  folders
    .find(folder => folder.id === folderId)
    ?.htmlFolders.find(htmlFolder => htmlFolder.path === path)
    ?.documents.find(document => document.fileName === fileName);

/**
 * 검색에서 견줄 글자로 바꾼다 — 대소문자를 가리지 않고, 한글 자모가 풀려 저장된 이름(macOS 파일 이름)도 합친 글자로 맞춘다
 */
export const toSearchText = (text: string): string => text.normalize("NFC").toLowerCase();

/**
 * 검색어로 목록을 거른다 (대소문자를 가리지 않는다). 위에서부터 먼저 맞는 것:
 * 등록 폴더 이름이 맞으면 그 폴더를 통째로 → 경로가 맞는 HTML 폴더는 통째로 → 문서 이름이 맞으면 그 문서만 남긴 HTML 폴더
 */
export const filterFolders = (folders: RegisteredFolder[], query: string): FolderMatch[] => {
  const keyword = toSearchText(query.trim());

  return folders.flatMap((folder): FolderMatch[] => {
    if (!keyword || toSearchText(folder.name).includes(keyword)) return [{ folder, documentMatchedPaths: [] }];

    const documentMatchedPaths: string[] = [];
    const htmlFolders = folder.htmlFolders.flatMap(htmlFolder => {
      if (toSearchText(htmlFolder.path).includes(keyword)) return [htmlFolder];

      const documents = htmlFolder.documents.filter(document => toSearchText(document.name).includes(keyword));
      if (documents.length === 0) return [];

      documentMatchedPaths.push(htmlFolder.path);

      return [{ ...htmlFolder, documents }];
    });

    return htmlFolders.length > 0 ? [{ folder: { ...folder, htmlFolders }, documentMatchedPaths }] : [];
  });
};

/**
 * 다시 훑은 결과를 지금 목록에 합친다.
 * 바뀐 것이 없으면 지금 목록을 그대로 돌려주고(같은 객체), 바뀌었으면 그대로인 문서는 지금 것을 다시 쓴다 —
 * 열려 있는 문서의 연결(handle)이 바뀌지 않아 문서를 다시 읽지 않는다
 */
export const mergeHtmlFolders = (current: HtmlFolder[], scanned: HtmlFolder[]): HtmlFolder[] => {
  let changed = current.length !== scanned.length;

  const merged = scanned.map((scannedFolder, index) => {
    const currentFolder = current.find(folder => folder.path === scannedFolder.path);
    if (!currentFolder) {
      changed = true;
      return scannedFolder;
    }

    const isSame =
      currentFolder.documents.length === scannedFolder.documents.length &&
      currentFolder.documents.every((document, at) => document.fileName === scannedFolder.documents[at].fileName);

    if (isSame) {
      if (current[index] !== currentFolder) changed = true;
      return currentFolder;
    }

    changed = true;

    return {
      path: scannedFolder.path,
      documents: scannedFolder.documents.map(
        document => currentFolder.documents.find(existing => existing.fileName === document.fileName) ?? document,
      ),
    };
  });

  return changed ? merged : current;
};
