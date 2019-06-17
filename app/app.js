/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

// Needed for redux-saga es6 generator support
import '@babel/polyfill';

// Import all the third party stuff
import React from 'react';
import ReactDOM from 'react-dom';
import Axios from 'axios';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import FontFaceObserver from 'fontfaceobserver';
import history from 'utils/history';
import 'sanitize.css/sanitize.css';

// Import root app
import App from 'containers/App';

// Import Language Provider
import LanguageProvider from 'containers/LanguageProvider';

// Load the favicon and the .htaccess file
import '!file-loader?name=[name].[ext]!./images/favicon.ico';
import 'file-loader?name=.htaccess!./.htaccess'; // eslint-disable-line import/extensions

import configureStore from './configureStore';

// Import i18n messages
import { translationMessages } from './i18n';

// Observe loading of Open Sans (to remove open sans, remove the <link> tag in
// the index.html file and this observer)
const openSansObserver = new FontFaceObserver('Open Sans', {});

// When Open Sans is loaded, add a font-family using Open Sans to the body
openSansObserver.load().then(() => {
  document.body.classList.add('fontLoaded');
});

const initialState = {};
// const store = configureStore(initialState, history);

// function reducer(state = [], {payload}){
//   return [
//     ...state,
//     payload
//   ];
// }

// var store = createStore(reducer);

// store.subscribe(() => {
//   console.log('subscribe', store.getState());
// })

// class Todo extends React.Component {
//   state = { input: "" , todos: []};

//   inputChanged = ({ target }) => {
//     const { value: input } = target;
//     this.setState(state => ({ input }));
//   }

//   addTodo = (e) => {

//     e.preventDefault();

//     const todos = this.state.todos.concat([this.state.input]);

//     this.setState(state => ({
//       input: "",
//       todos: todos
//     }));
//   }

//   render() {

//     this.todosList = this.state.todos.map(function(name){
//       return <li key={name}>{name}</li>;
//     })

//     return (
//       <div>

//         <ul>
//           {this.todosList}
//         </ul>

//         <form onSubmit={this.addTodo}>
//         <input type="text" onChange={this.inputChanged} value={this.state.input} placeholder="TYPE IN MFucker" />{this.state.input}
//         <button type="submit" onClick={this.addTodo}>Add</button>
//         </form>
//       </div>
//       );
//   }
// }

class BreedList extends React.Component {

  state = { "breeds": [], breed: "" };

  getBreedsList = () => {
    Axios.get('https://dog.ceo/api/breeds/list/all').then(({data}) => {
      this.setState(state => ({
        breeds: data.message
      }))
    })
  }

  componentDidMount = () => {
    this.getBreedsList();
  }

  changebreedcallback = (breed, subbreed) => {
    //if second parameter is subbreed, not javascript event
    if(typeof subbreed !== "string"){
      subbreed = null;
    }
    this.props.changebreedcallback(breed, subbreed);
  }

  render(){

    let breedsList = Object.keys(this.state.breeds).map((breed, index) => {
      return (
        <li key={index} onClick={this.changebreedcallback.bind(this, breed)}>
          {breed}
          { this.state.breeds[breed].length ? <Subbreeds breed={breed} changebreedcallback={ this.changebreedcallback } data={ this.state.breeds[breed] } /> : null}
        </li>
      )
    });

    return (
      <div>
        <h1>BREEDS</h1>
        <ul>
          {breedsList}
        </ul>
      </div>
    )
  }
}

class BreedImg extends React.Component {

  state = {imgurl: ''};

  componentDidUpdate = (prevProps) => {

    if (this.props.breed === prevProps.breed && this.props.subbreed === prevProps.subbreed) return;

    if(this.props.breed){
      let url = this.props.subbreed ? 'https://dog.ceo/api/breed/' + this.props.breed + '/' + this.props.subbreed + '/images/random' : 'https://dog.ceo/api/breed/' + this.props.breed + '/images/random';
      Axios.get(url).then(({data}) => {
        this.setState({imgurl: data.message});
      })
    }

  }

  render = () => {

    return (
      <div>
        {this.props.breed} {this.props.subbreed ? " ->" + this.props.subbreed : null}
        <img src={this.state.imgurl} />
      </div>
    )
  }
}

class Subbreeds extends React.Component {

  changebreedcallback = (breed, subbreed, event) => {
    event.stopPropagation();
    this.props.changebreedcallback(breed, subbreed);
  }

  render = () => {

    const subbreeds = this.props.data.map((subbreed, index) => {
      return <li key={index} onClick={this.changebreedcallback.bind(this, this.props.breed, subbreed)}>{subbreed}</li>
    })

    return (
      <ul>
        {subbreeds}
      </ul>
    )
  }
}

class DogApp extends React.Component {

  state = {
    breed: "",
    subbreed: ""
  }

  changeImg = (breed, subbreed) => {
    this.setState(state => ({
      breed: breed,
      subbreed: subbreed
    }));
  }

  render(){
    return (
      <div>
        <BreedImg breed={this.state.breed} subbreed={this.state.subbreed}></BreedImg>        
        <BreedList changebreedcallback={this.changeImg}></BreedList>
      </div>
    )
  }
}

// ReactDOM.render(
//   <Todo />,
//   document.getElementById('todo')
// );

ReactDOM.render(
    <Provider store={store}>
      <DogApp />
    </Provider>,
  document.getElementById('dog')
);





