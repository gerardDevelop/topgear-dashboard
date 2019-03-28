import React, { Component } from 'react';
import '../css/spinner.css';

class TokenSurvey extends Component {

  constructor(props) {
    super(props);

    this.state = {
      surveyId : null,
      questions: [],
      answers: [],
      stockNo: null,
      companyId: null,
      token: null,
      completed: false
    };
  }

  onTextFieldChange(e, key) {
    var answers = this.state.answers;
    answers[key - 1].answer = e.target.value;

    this.setState({
      answers : answers
    });

    console.log("on text field change");
  }

  onInputClick(yesBool, key, e) {
    console.log("value = " + key + " is " + yesBool);

    var answers = this.state.answers;
    answers[key - 1].answer = yesBool;

    this.setState({
      answers: answers
    });
  }

  onSubmit(e) {
    e.preventDefault();
    console.log("on submit");

    console.log(this.state.answers);
    this.sendAnswers();
  }

  componentDidMount() {
    this.getSurvey();
  }

  getSurvey() {
    const params = new URLSearchParams(this.props.location.search);
    //const stockNo = params.get('StockNo');
    //const companyId = params.get('CompanyId');
    //const surveyId = params.get('SurveyId');

    const token = params.get('token');

    console.log("token: " + token);

    if(token) {

    this.setState({
      token: token
    });

    console.log("getting survey");

    fetch('/api/tokenSurvey?token=' + token)
      .then(response => response.json())
      .then(data =>  
        {
        console.log(data)

        if(data && !data.completed) {
          console.log("received survey");

          var incr = 1;
          var answers = [];

          var questions = data.questions.map(question => {
              question.key = incr;
              answers[incr - 1] = {
                answer: null
              };
              
              console.log("setting key for " + incr);
              incr++;
              return question;
          });
          
          this.setState({
            //surveyId: data.SurveyId,
            questions: questions,
            answers : answers,
            //stockNo: stockNo,
            //companyId: companyId
          });
        } else if(data.completed) {
          console.log("Survey has already been completed");
          this.setState({
            completed: true
          });
          // disable interface, etc and display message
        } else {
          console.log("didn't receive survey");
        }

        //this.setState({ resp : data.rows }) 
      })

      .catch(error => console.log(error));
    } else {
      console.log("no id given");
    }
  }

  sendAnswers() {
    console.log("sending answers");
    
    fetch('/api/tokenSurvey', {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, cors, *same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
         "Content-Type": "application/json",
         //"Content-Type": "application/x-www-form-urlencoded",
      },
      //redirect: "follow", // manual, *follow, error
      referrer: "no-referrer", // no-referrer, *client
      body: JSON.stringify({ 

        /*
        surveyId: this.state.surveyId,
        answers: this.state.answers,
        stockNo: this.state.stockNo,
        companyId: this.state.companyId
        */

        token: this.state.token,
        answers: this.state.answers

      }), // body data type must match "Content-Type" header
    })
    .then(response => response.json())
    .then(data => console.log("received resp " + data.msg));
      
      
      /*
      (response.json())
    .then(data => console.log({data}))) // TODO place this in state
    .catch(error => console.log(error));
    */
  }

  getQuestionJSX(question) {
    
    if(question.type === "bool") {
      return (
        <div className="form-check" key={question.key}>
          <label>{question.question}</label><br/>
          
          <input className="form-check-input" name={'radio' + question.key} id={'radioyes' + question.key} type="radio" onClick={(e) => this.onInputClick(true, question.key, e)}></input>
          <label className="form-check-label" htmlFor={'radioyes' + question.key}>Yes</label> <br/>
          
          <input className="form-check-input" name={'radio' + question.key} id={'radiono' + question.key} type="radio" onClick={(e) => this.onInputClick(false, question.key, e)}></input>
          <label className="form-check-label" htmlFor={'radiono' + question.key}>No</label> 
          <p></p>
        </div>
      );
    }
    else if(question.type === "text") {

      return (
        <div className="form-group" key={question.key}>
          <label>{question.question}</label><br/>
          <textarea className="form-control" id="exampleFormControlTextarea1" rows="4" onChange={(e) => {this.onTextFieldChange(e, question.key)}} ></textarea>
          <p></p>
        </div>
      );
    } else {
      return null; // or todo some message that the question didn't load properly
    }
  }

  render() {

    const getQuestionJSX = this.getQuestionJSX.bind(this);

    if(!this.state.completed) {
      return (
        <div className="container">
          <div className="card mt-3 mb-4">
            <div className="card-body">
              <h2>Survey for Toyota Corolla 2018</h2>
            </div>
          </div>

          <form>
            {this.state.questions.map(question => 
              this.getQuestionJSX(question)
            )}
            <button type="submit" className="btn btn-primary" onClick={(e) => this.onSubmit(e)}>Submit</button>
          </form>
        </div>
      );
    } else {  // todo center the <p> text here
      return (
        <div className="container">
          
          <p>Survey already completed</p>
        </div>   
      );
    }

    

    
  }
}

export default TokenSurvey;