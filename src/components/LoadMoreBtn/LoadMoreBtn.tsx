import css from "./LoadMoreBtn.module.css";

interface LoadMoreBtnProps {
  onClick: () => void;
  disabled: boolean;
}

const LoadMoreBtn = ({ onClick, disabled }: LoadMoreBtnProps) => (
  <div className={css.container}>
    <button className={css.button} onClick={onClick} disabled={disabled}>
      {disabled ? "Loading..." : "Load more"}
    </button>
  </div>
);

export default LoadMoreBtn;
