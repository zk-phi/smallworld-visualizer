import { createSignal, createMemo, JSX, For, Show } from "solid-js";
import { toHiragana } from "wanakana";

import css from "./index.module.css";
import { Button } from "../Button";
import cards from "../../constants/cards.json";

type Props = {
  selectedCards: string[][];
  onAddCard: (card: string[]) => void;
};

export const CardFinder = (props: Props) => {
  const [searchText, setSearchText] = createSignal("");
  const [collapsed, setCollapsed] = createSignal(false);

  const cardIsSelected = createMemo(() => {
    const table: Record<string, boolean> = {};
    props.selectedCards.forEach(card => table[card[1]] = true);
    return table;
  });

  const filteredCards = createMemo(() => {
    const text = searchText();
    const kana = toHiragana(text);

    if (text === "") return [];
    return cards.filter(card => card[0].includes(kana) || card[1].includes(text));
  });

  const onChangeSearchText: JSX.EventHandler<HTMLInputElement, InputEvent> = (e) => {
    setSearchText(e.currentTarget.value);
  };

  const filteredEmptyState = (
    <tr><td rowSpan={ 7 }>(マッチするカードがありません)</td></tr>
  );

  return (
    <div class={ css.finder }>
      <div class={ css.title } onClick={ () => setCollapsed(collapsed => !collapsed) }>
        カード名から検索 [{ collapsed() ? "+" : "-" }]
      </div>
      <Show when={ !collapsed() }>
        <div class={ css.suggestions }>
          カード名: <input value={ searchText() } onInput={ onChangeSearchText } />
          <table>
            <For each={ filteredCards() } fallback={ filteredEmptyState }>
              { card => (
                <tr>
                  <td>{ card[1] }</td>
                  <td>{ card[2] }</td>
                  <td>{ card[3] }</td>
                  <td>{ card[4] }</td>
                  <td>{ card[5] }</td>
                  <td>{ card[6] }</td>
                  <td>
                    <Button
                        disabled={ cardIsSelected()[card[1]] }
                        onClick={ () => props.onAddCard(card) }>
                      追加
                    </Button>
                  </td>
                </tr>
              ) }
            </For>
          </table>
        </div>
      </Show>
    </div>
  );
};
