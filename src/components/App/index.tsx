import { createSignal, createEffect } from "solid-js";
import Graphology from "graphology";
import ForceLayout from "graphology-layout-force/worker";
import Sigma from "sigma";
import ColorConvert from "color-convert";

import { Card } from "../../types";
import { RGB2YIQ, YIQ2RGB, rotYIQ } from "../../utils/yiq";
import css from "./index.module.css";
import { Header } from "../Header";
import { JointFinder } from "../JointFinder";
import { CardFinder } from "../CardFinder";

let relationToColor: Record<string, string> = {};
let lastColor = RGB2YIQ([238, 170, 0]);
const getColorForRelation = (relation: string) => {
  if (relationToColor[relation]) {
    return relationToColor[relation];
  } else {
    relationToColor[relation] = `#${ColorConvert.rgb.hex(YIQ2RGB(lastColor))}`;
    lastColor = rotYIQ(lastColor, 49); /* 49 has no common divisor with 360 */
    return relationToColor[relation];
  }
};

export const App = () => {
  const [selectedCards, setSelectedCards] = createSignal<Card[]>([]);

  let graphContainer: HTMLDivElement | undefined;
  let graph = new Graphology;
  createEffect(() => {
    const renderer = new Sigma(graph, graphContainer!, {
      renderEdgeLabels: true,
    });
    const layout = new ForceLayout(graph, {
      settings: {
        /* リンクの引き default: 0.0005 */
        attraction: 0.001,
        /* ノードの反発 default: 0.1 */
        repulsion: 10,
        /* 中央に集まろうとする力 default: 0.0001 */
        gravity: 0.001,
        /* 摩擦 vs 慣性 default: 0.6 */
        inertia: 0.6,
        maxMove: 200,
      },
    });
    layout.start();
  });

  const onAddCard = (card: Card) => {
    const cards = selectedCards();
    setSelectedCards([...cards, card]);
    try {
      graph.addNode(card[1], {
        size: 12,
        x: Math.random(),
        y: Math.random(),
        label: card[1],
        color: "#888",
      });
      cards.forEach(existingCard => {
        const prefixes = ["", "", "", "レベル", "", "ATK", "DEF"];
        const similarity = existingCard.map((_, ix) => (
          existingCard[ix] === card[ix] ? prefixes[ix] + card[ix] : ""
        )).filter(x => (
          x
        ));
        if (similarity.length === 1) {
          graph.addEdge(existingCard[1], card[1], {
            label: similarity[0],
            size: 5,
            color: getColorForRelation(similarity[0]),
          });
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
