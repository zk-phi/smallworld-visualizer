import { createSignal, createEffect } from "solid-js";
import Graphology from "graphology";
import ForceLayout from "graphology-layout-force/worker";
import Sigma from "sigma";

import css from "./index.module.css";
import { Header } from "../Header";
import { JointFinder } from "../JointFinder";
import { CardFinder } from "../CardFinder";

export const App = () => {
  const [selectedCards, setSelectedCards] = createSignal<string[][]>([]);

  let graphContainer: HTMLDivElement | undefined;
  let graph = new Graphology;
  createEffect(() => {
    const renderer = new Sigma(graph, graphContainer!, {
      renderEdgeLabels: true,
    });
    const layout = new ForceLayout(graph, {
      settings: {
        /* リンクの引き default: 0.0005 */
        attraction: 0.0001,
        /* ノードの反発 default: 0.1 */
        repulsion: 10,
        /* 中央に集まろうとする力 default: 0.0001 */
        gravity: 0.0005,
        /* 摩擦 vs 慣性 default: 0.6 */
        inertia: 0.6,
        maxMove: 200,
      },
    });
    layout.start();
  });

  const onAddCard = (card: string[]) => {
    const cards = selectedCards();
    setSelectedCards([...cards, card]);
    try {
      graph.addNode(card[1], {
        size: 12,
        x: Math.random(),
        y: Math.random(),
        label: card[1],
        color: "#ea0",
      });
      cards.forEach(existingCard => {
        const prefixes = ["", "", "", "レベル", "", "ATK", "DEF"];
        const similarity = existingCard.map((_, ix) => (
          existingCard[ix] === card[ix] && (prefixes[ix] + card[ix])
        )).filter(x => (
          x
        ));
        if (similarity.length === 1) {
          graph.addEdge(existingCard[1], card[1], { label: similarity[0], size: 5 });
        }
      });
    } catch (e) {}
  };

  return (
    <div>
      <Header />
      <div ref={ graphContainer } class={ css.graph }></div>
      <div class={ css.finders }>
        <JointFinder selectedCards={ selectedCards() } onAddCard={ onAddCard } />
        <CardFinder selectedCards={ selectedCards() } onAddCard={ onAddCard } />
      </div>
    </div>
  );
};
