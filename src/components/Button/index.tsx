import css from "./index.module.css";

type Props = {
  children: string;
  disabled: boolean;
  onClick: () => void;
};

export const Button = (props: Props) => (
  <button
      class={ css.button }
      disabled={ props.disabled }
      onClick={ props.onClick }>
    { props.children }
  </button>
);
