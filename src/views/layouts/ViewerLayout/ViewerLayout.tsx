import { BrandLogo } from "@views/components/common";

import type { ViewerLayoutProps } from "./ViewerLayout.types";

/** 화면 틀 — 본문이 화면 전체를 쓰고, 로고는 그 위 오른쪽에 뜬다 */
const ViewerLayout = ({ children }: ViewerLayoutProps) => (
  <div className="relative h-screen overflow-hidden bg-bg-canvas">
    <main className="h-full">{children}</main>
    {/* 로고는 누를 수 없다 — 아래 본문을 가리지 않게 마우스를 통과시킨다 */}
    <div className="pointer-events-none absolute top-12 right-16 flex h-32 items-center drop-shadow-logo">
      {/* 흰 번짐은 안쪽에, 옅은 검정 그림자는 바깥에 건다 */}
      <div className="flex drop-shadow-logo-glow">
        <BrandLogo />
      </div>
    </div>
  </div>
);

export default ViewerLayout;
