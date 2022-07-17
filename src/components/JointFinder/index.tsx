import { createSignal, createMemo, For, Show } from "solid-js";

import css from "./index.module.css";
import { Button } from "../Button";
import cards from "../../constants/cards";

type Props = {
  selectedCards: string[][];
  onAddCard: (card: string[]) => void;
};

export const JointFinder = (props: Props) => {
  const [selectedTargets, setSelectedTargets] = createSignal<string[][]>([]);
  const [collapsed, setCollapsed] = createSignal(true);

  const filteredCards = createMemo(() => {
    const targets = selectedTargets();
    if (!targets.length) {
      return [];
    }
    return cards.filter(card => (
      targets.every(target => (
        target.reduce((acc, _, ix) => acc + (target[ix] === card[ix] ? 1 : 0), 0) === 1
      ))
    ));
  });

  const targetIsSelected = createMemo(() => {
    const table: Record<string, boolean> = {};
    selectedTargets().forEach(target => table[target[1]] = true);
    return table;
  });

  const cardIsSelected = createMemo(() => {
    const table: Record<string, boolean> = {};
    props.selectedCards.forEach(target => table[target[1]] = true);
    return table;
  });

  const onToggleCard = (card: string[]) => {
    if (targetIsSelected()[card[1]]) {
      setSelectedTargets(targets => targets.filter(target => target[1] !== card[1]));
    } else {
      setSelectedTargets(targets => [...targets, card ]);
    }
  };

  const targetEmptyState = (
    <tr><td rowSpan={ 7 }>(「カード名から検索」でカードを登録してください)</td></tr>
  );

  const filteredEmptyState = (
    <tr><td rowSpan={ 7 }>(中継できるカードはありません)</td></tr>
  );

  return (
    <div class={ css.finder }>
      <div class={ css.title } onClick={ () => setCollapsed(collapsed => !collapsed) }>
        中継カードを探す [{ collapsed() ? "+" : "-" }]
      </div>
      <Show when={ !collapsed() }>
        <div class={ css.suggestions }>
          行き来できるようにしたいカード：
          <table>
            <For each={ props.selectedCards } fallback={ targetEmptyState }>
              { card => (
                <tr>
                  <td>
                    <input
                        type="checkbox"
                        checked={ targetIsSelected()[card[1]] }
                        onInput={ () => onToggleCard(card) } />
                  </td>
                  <td>{ card[1] }</td>
                  <td>{ card[2] }</td>
                  <td>{ card[3] }</td>
                  <td>{ card[4] }</td>
                  <td>{ card[5] }</td>
                  <td>{ card[6] }</td>
                </tr>
              ) }
            </For>
          </table>
          候補：
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
