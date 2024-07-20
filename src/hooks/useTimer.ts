import { useEffect, useState } from "react";

export const useTimer = (initialTime: number) => {
  const [time, setTime] = useState(initialTime);

  useEffect(() => {
    let timeoutId = undefined;
    if (time > 0) {
      timeoutId = setTimeout(() => {
        setTime((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [time]);

  const resetTimer = () => {
    setTime(initialTime);
  };

  return {
    time,
    resetTimer,
  };
};
