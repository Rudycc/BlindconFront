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
    }
  }

  componentWillMount() {
    this.getPlaces()
  }

  getPlaces = () => {
    axios.get('api/places').then(({data: places}) => {
      const routes = []
      places.forEach((place, i) => {
        for (let key in place.links) {
          if (places.findIndex(p => p.place === key) > i) {
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
    newRoute[index][key] = event.target.value < 0 || isNaN(Number(event.target.value)) ? 0 : Number(event.target.value)
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
    <tr className="table-header">
      <td>Origen</td>
      <td>Destino</td>
      <td>Activo</td>
      <td>Distancia</td>
      <td>Tiempo(s)</td>
      <td>Peso</td>
    </tr>
  )

  renderRow = (row, i) => (
    <tr className="table-row">
      <td>
        {row.from.place}
      </td>
      <td>
        {row.to.place}
      </td>
      <td>
        <input type='checkbox' onChange={this.toggleEditActive(i)} checked={row.active} />
      </td>
      <td>
        <input type='number' onChange={this.updateRouteForm(i)('distance')} value={row.distance}/>
      </td>
      <td>
        <input type='number' onChange={this.updateRouteForm(i)('time')} value={row.time} />
      </td>
      <td>
        <input type='number' onChange={this.updateRouteForm(i)('weight')} value={row.weight}/>
      </td>
      <td>
        <input type='button' value='Actualizar ruta' onClick={this.updateRoute(i)} />
      </td>
    </tr>
  )

  renderAddRoute = () => (
    <form className="add-route">
      <div>
        <label>Origen</label>
        <select onChange={this.updateForm('from')} value={this.state.form.from}>
          { this.state.places.map(this.renderOption) }
        </select>
      </div>
      <div>
        <label>Destino</label>
        <select onChange={this.updateForm('to')} value={this.state.form.to}>
          { this.state.places.map(this.renderOption) }
        </select>
      </div>
      <span>
        <label>Activo</label>
        <input type='checkbox' onChange={this.toggleActive} checked={this.state.form.active} />
      </span>
      <span>
        <label>Distancia</label>
        <input type='number' value={this.state.form.distance} onChange={this.updateForm('distance')}/>
      </span>
      <span>
        <label>Tiempo</label>
        <input type='number' value={this.state.form.time} onChange={this.updateForm('time')}/>
      </span>
      <span>
        <label>Peso</label>
        <input type='number' value={this.state.form.weight} onChange={this.updateForm('weight')}/>
      </span>
      <input type='button' value='Agregar ruta' onClick={this.addRoute} />
    </form>
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
        <div className="table-container">
          <table>
            <thead>
              {this.renderHeader()}
            </thead>
            <tbody>
              {this.state.routes.map(this.renderRow)}
            </tbody>
          </table>
        </div>
        {this.renderAddRoute()}
      </div>
    );
  }
}

export default App;
