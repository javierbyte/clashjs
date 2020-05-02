import React from "react";
import _ from "lodash";

class Notifications extends React.Component {
  render() {
    var { messages } = this.props;
    var date = new Date();

    _.remove(messages, k => date - k.date > 4000);
    messages = _.sortBy(messages, k => k.date.valueOf);
    return (
      <div className="notifications">
        {_.map(messages, (k, idx) => {
          return <p key={idx}>{k.text}</p>;
        })}
      </div>
    );
  }
}

export default Notifications;
