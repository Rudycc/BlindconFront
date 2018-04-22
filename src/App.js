import React, { Component } from 'react';
import { instance as axios } from './utils'
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      places: [],
      routes: [],
      form: {
        from: 0,
        to: 0,
        active: false,
        weight: 0,
        distance: 0,
        time: 0,
      },
    }
  }

  componentWillMount() {
    axios.get('api/places').then(({data: places}) => {
      const routes = []
      places.forEach((place, i) => {
        for(let key in place.links) {
          if(places.findIndex(p => p.place === key) > i) {
            let { active, weight, distance, time } = place.links[key]
            let to = places.find(p => p.place === key)
            let route = {
              from: {
                place: place.place,
                id: place._id,
              },
              to: {
                place: to.place,
                id: to._id,
              },
              active,
              weight,
              distance,
              time,
            }
            routes.push(route)
          } 
        }
      })
      this.setState({
        places,
        routes,
      })
    }).catch(console.log)
  }

  addRoute = () => {
    console.log('Agregar coso')
  }

  updateForm = (key) => (event) => {
    this.setState({
      form: {
        ...this.state.form,
        [key]: event.target.value < 0 || isNaN(Number(event.target.value))? 0: Number(event.target.value),
      }
    })
  }

  toggleActive = () => {
    this.setState({
      form: {
        ...this.state.form,
        active: !this.state.form.active
      }
    })
  }

  renderRow = row => (
    <li style={{listStyleType: 'none'}}>
      <div style={{ width: '25%', display: 'inline-block' }}>
        {row.from.place}
      </div>
      <div style={{ width: '25%', display: 'inline-block' }}>
        {row.to.place}
      </div>
      <div style={{ width: '12.5%', display: 'inline-block' }}>
      {row.active? 'Activada': 'Desactivada'}
      </div>
      <div style={{ width: '12.5%', display: 'inline-block' }}>
      {row.distance}
      </div>
      <div style={{ width: '12.5%', display: 'inline-block' }}>
      {row.time}
      </div>
      <div style={{ width: '12.5%', display: 'inline-block' }}>
      {row.weight}
      </div>
    </li>
  )

  renderAddRoute = () => (
    <li style={{listStyleType: 'none'}}>
     <form onSubmit={this.addRoute}>
        <select style={{ width: '22%', display: 'inline-block' }} onChange={this.updateForm('from')} value={this.state.form.from}>
          { this.state.places.map(this.renderOption) }
        </select>
        <select style={{ width: '22%', display: 'inline-block' }} onChange={this.updateForm('to')} value={this.state.form.to}>
          { this.state.places.map(this.renderOption) }
        </select>
        <input type='checkbox' onChange={this.toggleActive} style={{ width: '12.5%', display: 'inline-block' }} checked={this.state.form.active} />
        <input type='number' value={this.state.form.distance} onChange={this.updateForm('distance')} style={{ width: '12.5%', display: 'inline-block' }} />
        <input type='number' value={this.state.form.time} onChange={this.updateForm('time')} style={{ width: '12.5%', display: 'inline-block' }} />
        <input type='number' value={this.state.form.weight} onChange={this.updateForm('weight')} style={{ width: '12.5%', display: 'inline-block' }} />
        <input type='submit' value='Agregar ruta' />
      </form>
    </li>
  )

  renderOption = (place, i) => (
    <option value={i}>{place.place}</option>
  )

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">BlindCon</h1>
        </header>
        <div>
          <ul>
            {this.state.routes.map(this.renderRow)}
            {this.renderAddRoute()}
          </ul>
        </div>
      </div>
    );
  }
}

export default App;
