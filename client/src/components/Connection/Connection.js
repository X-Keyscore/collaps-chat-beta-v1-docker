import React, { Component } from 'react'
import Login from "./Login";
import Register from "./Register";

class Connection extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isShowing: true
    }
  }

  toggle = () => {
    // Mise à jour de la vue avec inverseur
    this.setState((state) => {
      return {isShowing: state.isShowing ? false : true}
    });
	}

  render() {
    return (
      this.state.isShowing
        ?
        <Login setId={this.props.setId} setToken={this.props.setToken} setLoginValidity={this.props.setLoginValidity} hide={this.toggle} />
        :
        <Register setId={this.props.setId} setToken={this.props.setToken} setLoginValidity={this.props.setLoginValidity} hide={this.toggle} />
    )
  }
}

export default Connection