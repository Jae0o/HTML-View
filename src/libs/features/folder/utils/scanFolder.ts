import type { HtmlFolder, ScannedFile } from "../types";
import { groupHtmlFiles, isExcludedDirectory } from "./folderTree";

const collectFiles = async (
  directory: FileSystemDirectoryHandle,
  directories: string[],
  files: ScannedFile[],
): Promise<void> => {
  for await (const entry of directory.values()) {
    if (entry.kind === "file") {
      files.push({ directories, fileName: entry.name, handle: entry });
      continue;
    }

    if (!isExcludedDirectory(entry.name)) await collectFiles(entry, [...directories, entry.name], files);
  }
};

/** 등록 폴더를 끝까지 훑어 HTML 이 든 폴더 목록을 만든다 */
export const scanFolder = async (directory: FileSystemDirectoryHandle): Promise<HtmlFolder[]> => {
  const files: ScannedFile[] = [];

  await collectFiles(directory, [], files);

  return groupHtmlFiles(files);
};
