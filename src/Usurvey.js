import React, {Component} from 'react';
import config from './firebaseConfig'; // importing firebase API configurations from separate config file

// requiring dependencies:

var firebase = require('firebase');
var uuid = require('uuid');

// Initialize Firebase:

firebase.initializeApp(config);

class USurvey extends Component {

  constructor(props){
    super(props);

    this.state = {
      uid: uuid.v1(),
      studentName: '',
      answers: {
        answer1: '',
        answer2: '',
        answer3: '',
      },
      isSubmitted: false,
    };

    this.nameSubmit = this.nameSubmit.bind(this);
    this.answerSelected = this.answerSelected.bind(this);
    this.questionSubmit = this.questionSubmit.bind(this);

  }

  nameSubmit(event) {
    event.preventDefault();
    var studentName = this.refs.name.value; // getting value from input field
    this.setState({ studentName: studentName }, function() {
      console.log(this.state);
    });

  }

  answerSelected(event) {
    // console.log(event.target.value);//  getting the values from radio buttons
    var answers = this.state.answers;
    if (event.target.name === 'answer1') {
      answers.answer1 = event.target.value;
    } else if (event.target.name === 'answer2') {
      answers.answer2 = event.target.value;
    } else if (event.target.name === 'answer3') {
      answers.answer3 = event.target.value;
    }
    this.setState({ answers: answers }, function () {
      console.log(this.state);
    });
  }

  questionSubmit(event) {
    event.preventDefault();
    this.setState({isSubmitted: true });
    // setting values to database:
    firebase.database().ref('Usurvey/'+ this.state.uid).set({
      studentName:this.state.studentName,
      answers: this.state.answers,
    });
  }

  render(){

    var studentName;
    var questions;

    if(this.state.studentName === '' && this.state.isSubmitted === false) {
      studentName = <div className="header">
        <h1>Hey, please let us know your name:</h1>
        <form onSubmit={this.nameSubmit} method="POST">
          <input className="inputname" type="text" placeholder="Enter your name" ref="name"/>
        </form>
      </div>;
      questions = '';

    } else if (this.state.studentName !== '' && this.state.isSubmitted === false) {
      studentName = <h1>Hey there, {this.state.studentName}. Please take the survey</h1>;
      questions = <div>
        <hr />
        <h2>Here are some questions</h2>
        <form onSubmit={this.questionSubmit} method="POST">
          <div className="card">
            <label>What kind of courses you like?</label> <br />
            <input type="radio" name="answer1" value="Technology" onChange={this.answerSelected}/>Technology
            <input type="radio" name="answer1" value="Design" onChange={this.answerSelected}/>Design
            <input type="radio" name="answer1" value="Marketing" onChange={this.answerSelected}/>Marketing
          </div>
          <div className="card">
            <label>Who are you?</label> <br />
            <input type="radio" name="answer2" value="Student" onChange={this.answerSelected}/>Student
            <input type="radio" name="answer2" value="Teacher" onChange={this.answerSelected}/>Teacher
            <input type="radio" name="answer2" value="Other" onChange={this.answerSelected}/>Other
          </div>
          <div className="card">
            <label>Do you like the courses?</label> <br />
            <input type="radio" name="answer3" value="Yes" onChange={this.answerSelected}/>Yes
            <input type="radio" name="answer3" value="Maybe" onChange={this.answerSelected}/>Maybe
            <input type="radio" name="answer3" value="No" onChange={this.answerSelected}/>No
          </div>
          <input type="submit" className="feedback-button" />

        </form>

      </div>;
    } else if(this.state.isSubmitted===true && this.state.studentName !== ''){
      studentName = <h1 className="header">Thanks for answering the questions {this.state.studentName}!</h1>;
    }

    return(
      <div>
        {studentName}
        {questions}
      </div>
    );
  }
}

export default USurvey;
