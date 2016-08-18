"use strict";

//Component to create leaderboard Headder
var App = React.createClass({
  displayName: "App",

  getInitialState: function getInitialState() {
    return {
      campers: [],
      list: "recent",
      isLoading: true
    };
  },

  getCampers: function getCampers(list) {
    axios.get("https://fcctop100.herokuapp.com/api/fccusers/top/" + list).then(function (players) {
      //console.log(players.data)
      var i = 1;
      players.data.map(function (user) {
        user.rank = i;
        i++;
      });
      this.setState({
        campers: players.data,
        list: list,
        isLoading: false
      });
      console.log(this.state);
    }.bind(this));
  },

  handleRecentClick: function handleRecentClick() {
    this.setState({
      isLoading: true
    });
    this.getCampers("recent");
  },

  handleAllTimeClick: function handleAllTimeClick() {
    this.setState({
      isLoading: true
    });
    this.getCampers("alltime");
  },

  componentDidMount: function componentDidMount() {
    console.log(this.state);
    return this.getCampers(this.state.list);
  },

  render: function render() {
    //console.log(this.state)
    if (this.state.isLoading) {
      return React.createElement(
        "div",
        null,
        React.createElement(Nav, null),
        React.createElement(Loading, null)
      );
    }
    return React.createElement(
      "div",
      null,
      React.createElement(Nav, null),
      React.createElement(LeaderBoard, { campers: this.state.campers, list: this.state.list, recentClick: this.handleRecentClick, allTimeClick: this.handleAllTimeClick })
    );
  }
});

var Nav = function Nav() {
  return React.createElement(
    "nav",
    { className: "navbar navbar-default" },
    React.createElement(
      "a",
      { href: "#", className: "navbar-brand" },
      "FreeCodeCamp"
    )
  );
};

var caretThirty = "";
var caretAll = "";

///Not sure why I couldn't pass this into componentWillMount

var RecentColumn = function RecentColumn(props) {
  return React.createElement(
    "div",
    { onClick: props.onRecentClick, className: "header col-xs-3" },
    "Points Last 30 Days ",
    caretThirty
  );
};

var AllTimeColumn = function AllTimeColumn(props) {
  return React.createElement(
    "div",
    { onClick: props.onAllTimeClick, className: "header col-xs-3 text-center" },
    "All Time Points ",
    caretAll
  );
};

var LeaderBoard = React.createClass({
  displayName: "LeaderBoard",

  render: function render() {
    var campers = this.props.campers.map(function (camper) {
      return React.createElement(Camper, { camper: camper });
    });
    console.log("LeaderBoardComp", this.props);
    if (this.props.list === "recent") {
      caretThirty = React.createElement("i", { className: "fa fa-caret-down", "aria-hidden": "true" });
      caretAll = "";
    } else {
      caretThirty = "";
      caretAll = React.createElement("i", { className: "fa fa-caret-down", "aria-hidden": "true" });
    }
    return React.createElement(
      "div",
      { className: "container" },
      React.createElement(
        "h2",
        { className: "col-sm-12" },
        "LeaderBoard"
      ),
      React.createElement(
        "div",
        { className: "row" },
        React.createElement(
          "div",
          { className: "header col-xs-1" },
          "#"
        ),
        React.createElement(
          "div",
          { className: "header col-xs-5" },
          "Camper Name"
        ),
        React.createElement(RecentColumn, { onRecentClick: this.props.recentClick }),
        React.createElement(AllTimeColumn, { onAllTimeClick: this.props.allTimeClick })
      ),
      React.createElement(
        "ul",
        { className: "list-group" },
        campers
      )
    );
  }
});

var Camper = function Camper(props) {
  return React.createElement(
    "li",
    { className: "camper list-group-item" },
    React.createElement(
      "div",
      { className: "row" },
      React.createElement(
        "div",
        { className: "header col-xs-1" },
        props.camper.rank
      ),
      React.createElement(
        "div",
        { className: "header col-xs-5" },
        React.createElement(
          "div",
          { className: "col-xs-6 avatar" },
          React.createElement("img", { src: props.camper.img, className: "img-rounded img-responsive" })
        ),
        React.createElement(
          "div",
          { className: "info col-xs-6" },
          props.camper.username
        )
      ),
      React.createElement(
        "div",
        { className: "header col-xs-3" },
        props.camper.recent
      ),
      React.createElement(
        "div",
        { className: "header col-xs-3" },
        props.camper.alltime
      )
    )
  );
};

var styles = {
  container: {
    position: 'fixed',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    fontSize: '55px'
  },
  content: {
    textAlign: 'center',
    position: 'absolute',
    width: '100%',
    marginTop: '100px'
  }
};

var Loading = React.createClass({
  displayName: "Loading",

  getDefaultProps: function getDefaultProps() {
    return {
      text: 'Loading',
      speed: 300
    };
  },

  getInitialState: function getInitialState() {
    this.originalText = this.props.text;
    return {
      text: this.originalText
    };
  },

  componentDidMount: function componentDidMount() {
    var stopper = this.props.text + '...';
    this.interval = setInterval(function () {
      if (this.state.text === stopper) {
        this.setState({
          text: this.originalText
        });
      } else {
        this.setState({
          text: this.state.text + '.'
        });
      }
    }.bind(this), this.props.speed);
  },

  componentWillUnmount: function componentWillUnmount() {
    clearInterval(this.interval);
  },

  render: function render() {
    return React.createElement(
      "div",
      { style: styles.container },
      React.createElement(
        "p",
        { style: styles.content },
        " ",
        this.state.text,
        " "
      )
    );
  }
});

ReactDOM.render(React.createElement(App, null), document.getElementById("leaderboard"));