import { type FavoriteItem, favoriteKey, useViewerStore } from "@libs/features/viewer";

import { IconButton, Tooltip } from "@views/components/common";
import { StarIcon } from "@views/components/icons";

import { ROW_ACTION_REVEAL_CLASS } from "../../DocumentList.constants";

interface FavoriteButtonProps {
  item: FavoriteItem;
  /** 줄 이름 — 화면 낭독기가 「readme 즐겨찾기」 처럼 어느 항목의 별인지 읽는다 */
  name: string;
}

/** 줄 오른쪽의 별 — 즐겨찾기를 켜고 끈다. 꺼져 있으면 줄에 마우스를 올렸을 때만 보이고, 켜지면 늘 보인다 */
const FavoriteButton = ({ item, name }: FavoriteButtonProps) => {
  const key = favoriteKey(item);
  const isFavorite = useViewerStore(state => state.favorites.some(favorite => favoriteKey(favorite) === key));
  const toggleFavorite = useViewerStore(state => state.toggleFavorite);

  // 켜짐은 눌림 상태(aria-pressed)로 알린다 — 버튼 이름은 켜고 꺼도 바꾸지 않는다. 마우스 도움말은 짧게 둔다
  return (
    <Tooltip label={isFavorite ? "즐겨찾기 해제" : "즐겨찾기"}>
      <IconButton
        size="s"
        aria-label={`${name} 즐겨찾기`}
        pressed={isFavorite}
        icon={<StarIcon fill={isFavorite ? "currentColor" : "none"} />}
        className={isFavorite ? undefined : ROW_ACTION_REVEAL_CLASS}
        onClick={() => toggleFavorite(item)}
      />
    </Tooltip>
  );
};

export default FavoriteButton;
