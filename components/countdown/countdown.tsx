import { useEffect, useRef } from "react";
import Countdown from "react-countdown";

const Renderer = ({
  days,
  hours,
  minutes,
  seconds,
  completed,
}: {
  days: any;
  hours: any;
  minutes: any;
  seconds: any;
  completed: any;
}) => {
  if (completed) {
    return "Finished";
  } else {
    return (
      <span>
        {days}:{hours}:{minutes}:{seconds}
      </span>
    );
  }
};

export default Renderer;
