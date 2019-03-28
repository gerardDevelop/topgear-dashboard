import React, { Component } from 'react';

class Other extends Component {

  constructor(props) {
    super(props);

    this.state = {
      resp: null,
    };
  }
  
  componentDidMount() {
    console.log("on other component did mount");

    const params = new URLSearchParams(this.props.location.search);
    const foo = params.get('foo');
    
    console.log("query param foo = " + foo);

    fetch('/api')
      .then(response => response.json())
      .then(data =>  
          this.setState({resp : data.info
      }) ) //this.setState({ data }))
      .catch(error => console.log(error));
  }

  render() {

    const params = new URLSearchParams(this.props.location.search);
    const foo = params.get('foo');

    return (
      <div>
        <p>Other component foo = {foo}</p>
        <p>Data = {this.state.resp}</p>
      </div>
    );
  }
}

export default Other;