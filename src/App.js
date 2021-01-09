import human from './human.png';
import React, { Component } from 'react';
import './App.css';
import { Container, Button, Form, Modal} from 'semantic-ui-react'
import axios from 'axios';
import ConfettiCanvas from 'react-confetti-canvas';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: 0,
      longitude: 0,
      showModal: false,
      isDrowning: false,
      inspirationQuotes: [],
      quote: '',
      author: '',
      addresses: []
    };

    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.findQuote = this.findQuote.bind(this);
    this.fetchAddress = this.fetchAddress.bind(this);
  }

  componentDidMount() {
    this.fetchQuotes();
  }

  fetchQuotes = async () => {
    await axios.get("https://type.fit/api/quotes")
    .then(response => {
      this.setState({
        inspirationQuotes: response.data
      });
    })
    .catch(error => console.error(error))
  }

  fetchAddress = async () => {
    const {latitude, longitude} = this.state;
    await axios.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latitude + "," + longitude + "&key=AIzaSyA9umthbEuph3aHr6-fWsEiPKtWAVGssfA")
    .then(response => {
      console.log(response.data.results)
      this.setState({
        addresses: response.data.results
      });
    })
    .catch(error => console.error(error))
  }

  onChangeHandler = (event) => {
    const value = event.target.value;
    this.setState({
        [event.target.name] : value
    })
  }

  handleSearch = async () => {
    const search = {
      longitude: parseFloat(this.state.longitude).toFixed(2),
      latitude: parseFloat(this.state.latitude).toFixed(2)
    }
    this.checkDrowning(search.longitude, search.latitude)
    this.fetchAddress()
  }

  checkDrowning = async (longitude, latitude) => {
    await axios.get("https://api.onwater.io/api/v1/results/" + latitude + "," + longitude + "?access_token=GY-kZ1a_fKoME8juAJcZ")
    .then(response => {
      console.log(response.data)
      this.setState({
        showModal: true,
        isDrowning: response.data.water
      });
      this.findQuote()
    })
    .catch(error => console.error(error))
  }

  findQuote = async () => {
    const {inspirationQuotes} = this.state;
    const randomQuote = inspirationQuotes[Math.floor(Math.random() * inspirationQuotes.length)]
    console.log()
    this.setState({
      quote: randomQuote.text,
      author: randomQuote.author
    });
  }

  handleModalClose = () => {
    this.setState({
        showModal : false
    })
  }

  render() {
    const {showModal, quote, author, isDrowning, latitude, longitude, addresses} = this.state;
    const renderConfetti = ()=>{
      if(!isDrowning){
        return <ConfettiCanvas
        duration={0.001} />
      }
    }
    return (
      <div className="App">
        <header className="App-header">
          <img src={human} className="App-logo" alt="logo" />
          <p>
            Are you drowning?
          </p>
        </header>
        <Container>
          <Form>
            <Form.Group widths='equal'>
              <Form.Field label='latitude'  name='latitude' min='-85' max='85' step="0.01" type='number' control='input'  required onChange={this.onChangeHandler}/>
              <Form.Field label='longitude' name='longitude' min='-180' max='180' step="0.01" type='number' control='input' required onChange={this.onChangeHandler}/>
            </Form.Group>
            <Button variant="primary" onClick={this.handleSearch}>
              Find me!
            </Button>
          </Form>
        </Container>
        <Modal open={showModal} onClose={this.handleModalClose}>
          <Modal.Header closeButton>
            Where am I?
          </Modal.Header>
          <Modal.Content>
            <b>{isDrowning? 'You\'re drowning but it\'s ok!': 'You\'re safe on land! Congrats!'}</b>
            <p> {(addresses[0])? "You\'re near " + (addresses[0]).formatted_address: "We have no clue where you are"}</p>
            <br></br>
            <img src={"https://maps.googleapis.com/maps/api/staticmap?markers=size:small%7C" + latitude + ',' +longitude + "&zoom=11&size=400x400&key=AIzaSyBoyAr-jdEmaxd9jSVHBwCkeohtXOZdN2g"}></img>
            <br></br>
            {renderConfetti()}
            <br></br>
            <p>{isDrowning? 'Here\'s a motivational quote to get you out of sad waters:': 'Here\'s a quote to cheer your success on:'}</p>
            <p> </p>
            <br></br>
            {quote}
            {' ~' + author}
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}

export default App;
