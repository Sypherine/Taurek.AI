import { useEffect, useRef, useState } from "react";
import { ECO_LEVELS } from "../types";

interface Props {
  points: number;
}

export default function EcoPoints({ points }: Props) {
  const level = ECO_LEVELS.find((l) => points >= l.min && points <= l.max)!;
  const nextLevel = ECO_LEVELS.find((l) => l.min > points);
  const prevPoints = useRef(points);
  const [showPlus, setShowPlus] = useState(false);

  const progressMax = nextLevel ? nextLevel.min - level.min : 1;
  const progressVal = nextLevel ? points - level.min : 1;
  const progressPct = Math.min((progressVal / progressMax) * 100, 100);

  useEffect(() => {
    if (points > prevPoints.current) {
      setShowPlus(true);
      setTimeout(() => setShowPlus(false), 1000);
    }
    prevPoints.current = points;
  }, [points]);

  return (
    <div className="eco-points">
      <span className="eco-points__icon">🌿</span>
      <div className="eco-points__info">
        <div className="eco-points__top">
          <span className="eco-points__count">{points} pts</span>
          <span className="eco-points__label">{level.label}</span>
          {showPlus && <span className="eco-points__plus">+1</span>}
        </div>
        <div className="eco-points__bar">
          <div className="eco-points__bar-fill" style={{ width: `${progressPct}%` }} />
        </div>
      </div>
    </div>
  );
}
