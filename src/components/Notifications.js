import React, { useRef, useEffect } from "react";

const MAX_NOTIF = 7;

function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    let id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
}

function Notifications(props) {
  const [dateTime, setDateTime] = React.useState(new Date().getTime());
  const { notifications } = props;

  const filteredKeys = notifications
    .filter((el) => el && el.text)
    .filter((el) => dateTime < el.expire)
    .sort((a, b) => a.date - b.date)
    .slice(MAX_NOTIF * -1);

  useInterval(() => {
    setDateTime(new Date().getTime());
  }, 50);

  return (
    <div className="notifications">
      {filteredKeys.map((notificationData, notificationIdx) => {
        const hideByLength = notificationIdx <= filteredKeys.length - MAX_NOTIF;
        const showByTime = dateTime < notificationData.expire - 500;
        return (
          <Notification
            hide={hideByLength || !showByTime}
            key={notificationData.id}
            {...notificationData}
          />
        );
      })}
    </div>
  );
}

function Notification(props) {
  const [rendered, setRendered] = React.useState(false);
  const { hide } = props;

  useInterval(() => {
    setRendered(true);
  }, 16);

  return (
    <div
      className={`notifications-element ${props.id % 2 === 0 ? "-alt" : ""} ${
        rendered && !hide ? "" : "-hide"
      }`}>
      <div className="notifications-element-text">{props.text}</div>
    </div>
  );
}

export default Notifications;
