import React, { Component } from 'react';

class Tester extends Component {
  constructor(props) {
    super(props);

    this.state = {
      test: 'not set',
      fetchResp: "not response yet"
    };
  }

  componentDidMount() {

    const params = new URLSearchParams(this.props.location.search);
    const id = params.get('id');

    console.log("tester query param = " + id);

    this.setState({test: id});
    
    // run a fetch here (todo) based on the passed in query param (id)
    fetch('/api?id=' + id)
      .then(response => response.json())
      .then(data =>  
          this.setState({fetchResp : data.testresp
      }) ) //this.setState({ data }))
      .catch(error => console.log(error));
    
  }

  render() {

    console.log("rendering here ");

    return(
      <div>
        <p>state id: {this.state.test}</p>
        <p>test resp: {this.state.fetchResp}</p>
      </div>
    );       
  }
}

export default Tester;