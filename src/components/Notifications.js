import React from "react";

function Notifications(props) {
  const { notifications } = props;
  const dateTime = new Date().getTime();

  const filteredKeys = notifications
    .filter((el) => el && el.text)
    .filter((el) => el.date > dateTime - 5000)
    .sort((a, b) => b.date - a.date)
    .slice(0, 5);

  return (
    <div className="notifications">
      {filteredKeys.map((k, idx) => {
        return (
          <div className={`notifications-element ${k.id % 2 === 0 ? "-alt" : ""}`} key={idx}>
            {k.text}
          </div>
        );
      })}
    </div>
  );
}

export default Notifications;
