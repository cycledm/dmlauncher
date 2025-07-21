interface BasicStyle {
  background: string;
  text: string;
}

interface CardStyle extends BasicStyle {
  border: string;
  shadow: string;
}

export interface ColorStyle {
  root: BasicStyle;
  basic: BasicStyle;
  card: CardStyle;
}
