import { createSignal, createMemo, createEffect, For, Show, JSX } from "solid-js";

import { Card } from "../../types";
import css from "./index.module.css";
import { Button } from "../Button";
import cards from "../../constants/cards.json";

type Props = {
  selectedCards: Card[];
  onAddCard: (card: Card) => void;
  onDeleteCard: (card: Card) => void;
};

type Deck = {
  title: string;
  cards: Card[];
};

const storageDecks = window.localStorage.getItem("smallworld-visualizer/saved-decks");
const [savedDecks, setSavedDecks] = createSignal<Deck[]>(
  storageDecks ? JSON.parse(storageDecks) as Deck[] : []
);

export const StorageManager = (props: Props) => {
  const [deckName, setDeckName] = createSignal("");
  const [collapsed, setCollapsed] = createSignal(true);

  const emptyState = createMemo(() => {
    return <tr><td rowSpan={ 2 }>(保存されたデッキはありません)</td></tr>;
  });

  const onChangeDeckName: JSX.EventHandler<HTMLInputElement, InputEvent> = (e) => {
    setDeckName(e.currentTarget.value);
  };

  const onSaveDeck = () => {
    const decks = [...savedDecks(), { title: deckName(), cards: props.selectedCards }];
    window.localStorage.setItem("smallworld-visualizer/saved-decks", JSON.stringify(decks));
    setSavedDecks(decks);
  };

  const onDeleteDeck = (ix: number) => {
    const decks = savedDecks().filter((_, i) => i !== ix);
    window.localStorage.setItem("smallworld-visualizer/saved-decks", JSON.stringify(decks));
    setSavedDecks(decks);
  };

  const onLoadDeck = (ix: number) => {
    props.selectedCards.forEach(card => props.onDeleteCard(card));
    savedDecks()[ix].cards.forEach(card => props.onAddCard(card));
  };

  return (
    <div class={ css.finder }>
      <div class={ css.title } onClick={ () => setCollapsed(collapsed => !collapsed) }>
        セーブ/ロード [{ collapsed() ? "+" : "-" }]
      </div>
      <Show when={ !collapsed() }>
        <div class={ css.suggestions }>
          <div>
            ブラウザに保存するため、ブラウザのデータをクリアすると削除されます。ご注意ください。
          </div>
          デッキ名: <input value={ deckName() } onInput={ onChangeDeckName } />
          { " " }
          <Button onClick={ onSaveDeck }>セーブ</Button>
          <table>
            <For each={ savedDecks() } fallback={ emptyState }>
              { (deck, ix) => (
                <tr>
                  <td>{ deck.title }</td>
                  <td>
                    <Button onClick={ () => onLoadDeck(ix()) }>
                      ロード
                    </Button>
                    { " " }
                    <Button onClick={ () => onDeleteDeck(ix()) }>
                      削除
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
