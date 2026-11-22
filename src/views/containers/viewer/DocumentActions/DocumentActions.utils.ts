/** 문서 파일을 원래 파일 이름 그대로 내려받는다 — 저장 위치 · 묻기 여부는 브라우저 설정을 따른다 */
export const downloadDocument = async (handle: FileSystemFileHandle): Promise<void> => {
  const file = await handle.getFile();
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");

  link.href = url;
  link.download = file.name;
  link.click();

  // 내려받기가 시작된 뒤에 주소를 푼다
  setTimeout(() => URL.revokeObjectURL(url));
};

/** 문서 파일의 원문 글자를 클립보드에 넣는다 — 뷰어가 바꾼 HTML 이 아니라 파일 그대로 */
export const copyDocumentText = async (handle: FileSystemFileHandle): Promise<void> => {
  const file = await handle.getFile();

  await navigator.clipboard.writeText(await file.text());
};
