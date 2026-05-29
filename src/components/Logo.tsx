interface Props {
  size?: number;
  inkStroke?: string;
  brassStroke?: string;
}

export const Logo = ({ size = 34, inkStroke = '#1A1714', brassStroke = '#A87D43' }: Props) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" aria-hidden>
    <path d="M 18 30 Q 18 95 60 95 Q 102 95 102 30" stroke={inkStroke} strokeWidth="8" strokeLinecap="round" />
    <path d="M 38 38 Q 38 78 60 78 Q 82 78 82 38" stroke={brassStroke} strokeWidth="5" strokeLinecap="round" />
    <circle cx="60" cy="58" r="4.5" fill={brassStroke} />
  </svg>
);
