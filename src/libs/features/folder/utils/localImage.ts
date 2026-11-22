// 스킴이 있는 주소(http: · https: · data: · blob: …)는 바꾸지 않는다
const HAS_SCHEME = /^[a-z][a-z0-9+.-]*:/i;
// <img …> 태그의 src 값 — 따옴표로 감싼 값만. srcset · CSS url() 은 다루지 않는다
const IMG_SRC = /(<img\b[^>]*?\ssrc\s*=\s*)(["'])(.*?)\2/gi;
// btoa 에 한 번에 넘기는 바이트 수 — 큰 그림에서 인자 수 한도를 넘지 않게 끊는다
const CHUNK_SIZE = 0x8000;

/**
 * 문서 안 그림 경로를 등록 폴더 기준 경로 조각으로 푼다 — directories 는 문서가 든 폴더의 이름들.
 * 바꾸지 않을 주소(스킴 · // · # · 빈 글자)이거나 등록 폴더 위로 벗어나면 null
 */
export const resolveRelativePath = (directories: string[], src: string): string[] | null => {
  if (!src || src.startsWith("#") || src.startsWith("//") || HAS_SCHEME.test(src)) return null;

  const pathPart = src.split(/[?#]/)[0];
  let decoded = pathPart;
  try {
    decoded = decodeURIComponent(pathPart);
  } catch {
    // 잘못된 % 글자는 원문 그대로 쓴다
  }

  // / 로 시작하면 등록 폴더 맨 위 기준이다
  const segments = decoded.startsWith("/") ? [] : [...directories];

  for (const part of decoded.split("/")) {
    if (part === "" || part === ".") continue;
    if (part === "..") {
      if (segments.length === 0) return null;
      segments.pop();
      continue;
    }
    segments.push(part);
  }

  return segments.length > 0 ? segments : null;
};

const readFileAt = async (root: FileSystemDirectoryHandle, segments: string[]): Promise<File> => {
  let directory = root;
  for (const name of segments.slice(0, -1)) directory = await directory.getDirectoryHandle(name);

  return (await directory.getFileHandle(segments[segments.length - 1])).getFile();
};

const toDataUrl = async (file: File): Promise<string> => {
  const bytes = new Uint8Array(await file.arrayBuffer());
  let binary = "";
  for (let start = 0; start < bytes.length; start += CHUNK_SIZE) {
    binary += String.fromCharCode(...bytes.subarray(start, start + CHUNK_SIZE));
  }

  return `data:${file.type || "application/octet-stream"};base64,${btoa(binary)}`;
};

interface InlineImageOptions {
  /** 등록 폴더 연결 */
  root: FileSystemDirectoryHandle;
  /** 문서가 든 폴더의 이름들 (splitPath) */
  directories: string[];
}

/**
 * 문서 HTML 의 상대 경로 그림을 등록 폴더에서 읽어 data URL 로 바꿔 넣는다 (결정 MD-A14).
 * 문서 틀은 앱과 다른 출처라 blob 주소를 못 읽을 수 있어 data URL 을 쓴다.
 * 못 찾거나 못 읽은 그림은 그대로 둔다. HTML 을 DOM 으로 풀지 않고 src 값만 글자로 바꾼다 — 원본 글자를 지킨다
 */
export const inlineLocalImages = async (html: string, { root, directories }: InlineImageOptions): Promise<string> => {
  const sources = new Set<string>();
  for (const [, , , src] of html.matchAll(IMG_SRC)) {
    if (resolveRelativePath(directories, src)) sources.add(src);
  }
  if (sources.size === 0) return html;

  // 같은 그림은 한 번만 읽는다
  const dataUrls = new Map<string, string>();
  await Promise.all(
    [...sources].map(async src => {
      const segments = resolveRelativePath(directories, src);
      if (!segments) return;

      try {
        dataUrls.set(src, await toDataUrl(await readFileAt(root, segments)));
      } catch {
        // 못 찾음 · 못 읽음 — 그대로 둔다
      }
    }),
  );

  return html.replace(IMG_SRC, (match, before: string, quote: string, src: string) => {
    const dataUrl = dataUrls.get(src);

    return dataUrl ? `${before}${quote}${dataUrl}${quote}` : match;
  });
};
