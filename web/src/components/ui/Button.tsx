import styles from "./Button.module.scss";
import type { ButtonProps } from "../../types/ui";

export default function Button({ variant = "primary", className, ...props }: ButtonProps) {
  const classes = [styles.button, styles[variant], className]
    .filter(Boolean)
    .join(" ");

  return <button className={classes} {...props} />;
}
