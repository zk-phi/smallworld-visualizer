import { createSignal, Show } from "solid-js";
import css from "./index.module.css";
import { Button } from "../Button";

const [tutorialCompleted, setTutorialCompleted] = createSignal(
  !!window.localStorage.getItem("smallworld-visualizer/tutorial-completed")
);

export const TutorialModal = () => {
  const [skipStorageUpdate, setSkipStorageUpdate] = createSignal(false);

  const onClick = () => {
    if (!skipStorageUpdate()) {
      window.localStorage.setItem("smallworld-visualizer/tutorial-completed", "1");
    }
    setTutorialCompleted(true);
  };

  return (
    <Show when={ !tutorialCompleted() }>
      <div class={ css.tutorialModal }>
        <div class={ css.title }>
          このツールについて
        </div>
        <div class={ css.description }>
          <p>
            遊戯王 OCG に収録されている魔法カード《スモール・ワールド》をデッキに採用した場合のシミュレーションをしたり、中継に都合のいいカードを検索したりできます。
          </p>
          <p>
            まずは画面右下の「カード名から検索」でデッキに採用するカードを追加してみてください。
          </p>
          <p>
            <small>
              ※このツールではアクセス数などの集計に Cookie (Google Analytics) を使用しています。
            </small>
          </p>
        </div>
        <div class={ css.controls }>
          <Button onClick={ onClick }>はじめる</Button>
          { " " }
          <label>
            <input
                checked={ skipStorageUpdate() }
                onInput={ () => setSkipStorageUpdate(value => !value) }
                type="checkbox" />
            次回も表示する
          </label>
        </div>
      </div>
    </Show>
  );
};
