"use client";
import { useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import farmingAnimation from "@/assets/json/mascot.json";
import pointsAnimation from "@/assets/json/points.json";
import styles from "./style.module.scss";

function startPoints(ref: React.RefObject<LottieRefCurrentProps>) {
  const incrementTime = 9500;
  let lastTime = Date.now();
  let animationFrameId: number;

  const updatePoints = () => {
    const currentTime = Date.now();
    const elapsedTime = currentTime - lastTime;
    if (elapsedTime >= incrementTime) {
      ref.current?.play();
      setTimeout(() => {
        ref.current?.stop();
      }, 2000);
      lastTime = currentTime;
    }
    animationFrameId = requestAnimationFrame(updatePoints);
  };

  animationFrameId = requestAnimationFrame(updatePoints);

  return () => cancelAnimationFrame(animationFrameId);
}

export const Mascot = ({
  loadTrigger,
}: {
  loadTrigger: (val: boolean) => void;
}) => {
  const pointsRef = useRef<LottieRefCurrentProps>(null);

  useEffect(() => {
    if (pointsRef.current) {
      pointsRef.current.stop();
      const cancelAnimation = startPoints(pointsRef);
      loadTrigger(true);
      return cancelAnimation;
    }
  }, [loadTrigger]);

  return (
    <div className={styles.mascot__box}>
      <div className={styles.mascot}>
        <div className={styles.mascot__bottom}>
          <Image src="/images/chair-planet.svg" fill alt="bottom" />
        </div>
        <Lottie
          animationData={farmingAnimation}
          loop={true}
          className={styles.mascot__animation}
        />
        <Lottie
          lottieRef={pointsRef}
          animationData={pointsAnimation}
          className={styles.mascot__points}
          loop={false}
        />
      </div>
    </div>
  );
};
