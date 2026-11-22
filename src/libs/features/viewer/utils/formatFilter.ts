import { type DocumentFormat, type RegisteredFolder, documentFormatOf } from "@libs/features/folder";

/**
 * 켜진 형식의 문서만 남긴다 — 문서가 0 이 된 문서 폴더는 빼고, 등록 폴더는 남긴다(빈 줄 문구를 보인다).
 * 두 형식이 다 켜져 있으면 받은 배열을 그대로 돌려준다
 */
export const filterFoldersByFormat = (folders: RegisteredFolder[], formats: DocumentFormat[]): RegisteredFolder[] => {
  if (formats.includes("html") && formats.includes("md")) return folders;

  return folders.map(folder => ({
    ...folder,
    htmlFolders: folder.htmlFolders.flatMap(htmlFolder => {
      const documents = htmlFolder.documents.filter(document => {
        const format = documentFormatOf(document.fileName);

        return format !== null && formats.includes(format);
      });

      return documents.length > 0 ? [{ ...htmlFolder, documents }] : [];
    }),
  }));
};
