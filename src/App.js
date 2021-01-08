import human from './human.png';
import React, { Component } from 'react';
import './App.css';
import { Container, Button, Form, Modal} from 'semantic-ui-react'
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: 0,
      longitude: 0,
      showModal: false,
      drowning: false
    };

    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
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
    console.log(search.latitude)
    console.log(search.longitude)
    await axios.get("https://api.onwater.io/api/v1/results/" + search.latitude + "," + search.longitude + "?")
    .then(response => {
      this.setState({
        showModal: true,
        drowning: response.data.water
      });
      console.log(this.state.showModal)
    })
    .catch(error => console.error(error))
  }

  handleModalClose = () => {
    this.setState({
        showModal : false
    })
  }

  render() {
    const {showModal} = this.state;
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
            {this.drowning? 'You\'re drowning': 'You\'re safe'}
          </Modal.Content>
        </Modal>
      </div>
    );
  }

}


export default App;
