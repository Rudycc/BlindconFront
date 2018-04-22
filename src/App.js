import React, { Component } from 'react';
import { instance as axios } from './utils'
import swal from 'sweetalert'
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
      displayError: false,
      errorMessage: "",
    }
  }

  componentWillMount() {
    this.getPlaces()
  }

  getPlaces = () => {
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
    const { to, from, weight, active, time, distance } = this.state.form
    axios.post('api/routes', {
      route: {
        to: {
          id: this.state.places[to]._id,
        },
        from: {
          id: this.state.places[from]._id,
        },
        link: {
          active,
          weight,
          time,
          distance,
        }
      }
    }).then(() => {
      this.getPlaces()
    }).catch(err => {
      swal({
        title: "Ocurrio un error",
        text: err.response.data,
        icon: "error"
      })
    })
  }

  updateRoute = (index) => () => {
    const { to, from, weight, active, time, distance } = this.state.routes[index]
    axios.post('api/routes', {
      route: {
        to: {
          id: to.id,
        },
        from: {
          id: from.id,
        },
        link: {
          active,
          weight,
          time,
          distance,
        }
      }
    }).then(() => {
      this.getPlaces()
      swal({
        title: "Ruta actualizada",
        text: "Se actualizó la ruta con éxito",
        icon: "success"
      })
    }).catch(err => {
      swal({
        title: "Ocurrio un error",
        text: err.response.data,
        icon: "error"
      })
    })
  }

  updateForm = (key) => (event) => {
    this.setState({
      form: {
        ...this.state.form,
        [key]: event.target.value < 0 || isNaN(Number(event.target.value))? 0: Number(event.target.value),
      }
    })
  }

  updateRouteForm = (index) => (key) => (event) => {
    let newRoute = [...this.state.routes]
    newRoute[index][key] = event.target.value < 0 || isNaN(Number(event.target.value))? 0: Number(event.target.value)
    this.setState({
      routes: newRoute,
    })
  }

  toggleEditActive = (index) => () => {
    let newRoute = [...this.state.routes]
    newRoute[index].active = !this.state.routes[index].active
    this.setState({
      route: newRoute,
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

  renderHeader = () => (
    <li style={{listStyleType: 'none'}}>
      <div style={{ width: '25%', display: 'inline-block' }}>
        Origen
      </div>
      <div style={{ width: '25%', display: 'inline-block' }}>
        Destino
      </div>
      <div style={{ width: '5%', display: 'inline-block' }}>
        Activo
      </div>
      <div style={{ width: '15%', display: 'inline-block' }}>
      Distancia
      </div>
      <div style={{ width: '15%', display: 'inline-block' }}>
      Tiempo(s)
      </div>
      <div style={{ width: '15%', display: 'inline-block' }}>
      Peso
      </div>
    </li>
  )

  renderRow = (row, i) => (
    <li style={{listStyleType: 'none'}}>
      <div style={{ width: '25%', display: 'inline-block' }}>
        {row.from.place}
      </div>
      <div style={{ width: '25%', display: 'inline-block' }}>
        {row.to.place}
      </div>
      <input type='checkbox' onChange={this.toggleEditActive(i)} style={{ width: '5%', display: 'inline-block' }} checked={row.active} />
      <input type='number' onChange={this.updateRouteForm(i)('distance')} value={row.distance} style={{ width: '10%', display: 'inline-block' }} />
      <input type='number' onChange={this.updateRouteForm(i)('time')} value={row.time} style={{ width: '10%', display: 'inline-block' }} />
      <input type='number' onChange={this.updateRouteForm(i)('weight')} value={row.weight} style={{ width: '10%', display: 'inline-block' }} />
      <input type='button' value='Actualizar ruta' onClick={this.updateRoute(i)} />
    </li>
  )

  renderAddRoute = () => (
    <li style={{listStyleType: 'none'}}>
     <form>
        <select style={{ width: '22%', display: 'inline-block' }} onChange={this.updateForm('from')} value={this.state.form.from}>
          { this.state.places.map(this.renderOption) }
        </select>
        <select style={{ width: '22%', display: 'inline-block' }} onChange={this.updateForm('to')} value={this.state.form.to}>
          { this.state.places.map(this.renderOption) }
        </select>
        <input type='checkbox' onChange={this.toggleActive} style={{ width: '5%', display: 'inline-block' }} checked={this.state.form.active} />
        <input type='number' value={this.state.form.distance} onChange={this.updateForm('distance')} style={{ width: '10%', display: 'inline-block' }} />
        <input type='number' value={this.state.form.time} onChange={this.updateForm('time')} style={{ width: '10%', display: 'inline-block' }} />
        <input type='number' value={this.state.form.weight} onChange={this.updateForm('weight')} style={{ width: '10%', display: 'inline-block' }} />
        <input type='button' value='Agregar ruta' onClick={this.addRoute} />
      </form>
    </li>
  )

  renderOption = (place, i) => (
    <option value={i}>{place.place}</option>
  )

  render() {
    console.log(this.state)
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">BlindCon</h1>
        </header>
        <div>
          <ul>
            {this.renderHeader()}
            {this.state.routes.map(this.renderRow)}
            {this.renderAddRoute()}
          </ul>
        </div>
      </div>
    );
  }
}

export default App;
