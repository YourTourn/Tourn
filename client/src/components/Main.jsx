import React, { PropTypes } from 'react';
import { render } from 'react-dom';
import HeaderContainer from './HeaderContainer';
import RosterContainer from './RosterContainer.js';
import BracketContainer from './BracketContainer.js';
import ChatContainer from './ChatContainer';
import RulesContainer from './RulesContainer.js';
import { Provider } from 'react-redux';
import store from '../store.jsx';
import Test from './Test.jsx';
import { Grid, Row, Col } from 'react-bootstrap';


const Main = () => (
  <div>
    <HeaderContainer />
    <RosterContainer />
    <BracketContainer />
    <ChatContainer />
    <RulesContainer />
  </div>
)

        //{React.cloneElement(this.props.children, this.props)}


export default Main;
/////////////////////////////////////////////////////////////////
// var cloneWithProps = require('react-addons-clone-with-props');
//
// var _makeBlue = function(element) {
//   return cloneWithProps(element, {style: {color: 'blue'}});
// };
//
// var Blue = React.createClass({
//   render: function() {
//     var blueChildren = React.Children.map(this.props.children, _makeBlue);
//     return <div>{blueChildren}</div>;
//   }
// });
//
// ReactDOM.render(
//   <Blue>
//     <p>This text is blue.</p>
//   </Blue>,
//   document.getElementById('container')
// );
