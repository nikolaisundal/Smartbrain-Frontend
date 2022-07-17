import React, { Component } from 'react';
/* import Clarifai from 'clarifai' Flyttet til backend(image.js) */ 
// i vanlig JS hadde det vært:  const Clarifai = require('clarifai');
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Rank from './components/Rank/Rank';
import Particles from "react-tsparticles";
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import './App.css'; 


const particleOptions = {
  background: {
    color: {
      value: ""  
    },
  },
  fpsLimit: 60,
  interactivity: {
    detectsOn: "canvas",
    events: {
      onClick: {
        enable: false,
        mode: "push",
      },
      onHover: {
        enable: true,
        mode: "repulse",
      },
      resize: true,
    },
    modes: {
      bubble: {
        distance: 400,
        duration: 2,
        opacity: 0.8,
        size: 40,
      },
      push: {
        quantity: 4,
      },
      repulse: {
        distance: 200,
        duration: 0.4,
      },
    },
  },
  particles: {
    color: {
      value: "#ffffff",
    },
    links: {
      color: "#DA70D6",
      distance: 150,
      enable: true,
      opacity: 0.5,
      width: 1,
    },
    collisions: {
      enable: true,
    },
    move: {
      direction: "none",
      enable: true,
      outMode: "bounce",
      random: false,
      speed: 1.5,
      straight: false,
    },
    number: {
      density: {
        enable: true,
        value_area: 800,
      },
      value: 40,
    },
    opacity: {
      value: 0.5,
    },
    shape: {
      type: "circle",
    },
    size: {
      random: true,
      value: 5,
    },
  },
  detectRetina: true,
}



 const initialState =  {
  input: '',
  imageUrl:'',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''

  }
} 

 class App extends Component { 
  constructor() {
    super();
    this.particlesInit = this.particlesInit.bind(this);
    this.particlesLoaded = this.particlesLoaded.bind(this);
    this.state = initialState
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

/*   componentDidMount() { // denne er bare for å sjekke  om vi får kontakt med server.
    fetch('http://localhost:3000')
    .then(response => response.json())
    .then(console.log) //Shorthand for: (data => console.log(data))
  }
 */

  particlesInit(main) {
    
  }

  particlesLoaded(container) {
    
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) =>{
    this.setState({box: box})
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value})
  }

  /* Kunne hett onPictureSubmit */ 
  /* 2.30!!!! */
 onButtonSubmit = () => {  
      this.setState({imageUrl: this.state.input});
    /*   app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL ,
        this.state.input //Hvis man skriver imageUrl istedenfor input her får man error.
      ) Flytta til backend*/
      fetch('http://localhost:3000/imageurl', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                input: this.state.input
            })
          })
      .then(response => response.json())    
      .then(response => {
        if (response) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                id: this.state.user.id
            })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, {entries: count})) /* må bruke object assign hvis ikke blir */
          })
          .catch(console.log)
      }
        this.displayFaceBox(this.calculateFaceLocation(response))
    })  
      /* console.log(response.outputs[0].data.regions[0].region_info.bounding_box); */
      .catch((err) => console.log(err));
 }
         
  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState)
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
      this.setState({route: route});
}

  render() {  
   const { isSignedIn, imageUrl, route, box } = this.state; /* Destructure så man slipper this.state.box etc */
    return (
      <div className="App">
        <Particles
          id="tsparticles"
          init={this.particlesInit}
          loaded={this.particlesLoaded}
          options={particleOptions}
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        { route === 'home'
        ? <div> {/* må ha div her */}
            <Logo/>  
            <Rank 
              name={this.state.user.name}
              entries={this.state.user.entries}  
              />
            <ImageLinkForm 
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}/>
            <FaceRecognition box= {box} imageUrl={imageUrl}/>
          </div>
        : (
          route === 'signin'
          ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
          : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
        )
        }
        
      </div>
    );
  }
}

 export default App;  


