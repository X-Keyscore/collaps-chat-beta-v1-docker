import React, { Component } from 'react'
import api from '../../api'

class Register extends Component {
  constructor(props) {
    super(props)

    this.state = {
      pseudo: {
        value: "",
        warning: ""
      },
      password: {
        value: "",
        warning: ""
      }
    }
  }

  // Passe la valeur du "input" "pseudo" à l'état local
  handleChangeInputPseudo = async (event) => {
    const pseudo = event.target.value
    this.setState({
      pseudo: {
        value: pseudo,
        warning: ""
      }
    })
  }

  // Passe la valeur de "input" "password" à l'état local
  handleChangeInputPassword = async (event) => {
    const password = event.target.value
    this.setState({
      password: {
        value: password,
        warning: ""
      }
    })
  }

  // Soumission du formulaire
  submitLoginUser = async (e) => {
    e.preventDefault()

    // Récuépration de létat local
    const { pseudo, password } = this.state

    // Je teste si les champs sont remplis
    if (pseudo.value.length !== 0 && password.value.length !== 0) {

      // Création du corp de la requête
      var payload = {
        pseudo: pseudo.value,
        password: password.value
      }

      // Requête a l'api pour rechercher le pseudo
      await api.loginUser(payload).then(res => {
        if (!res.data.status.success) {// Je teste si la requête a abouti
          this.setState({
            pseudo: {
              value: pseudo.value,
              warning: 'Une erreur est survenu'
            }
          })
        } else if (!res.data.status.pseudoValide) { // Je teste si le pseudo et valide
          this.setState({
            pseudo: {
              value: pseudo.value,
              warning: 'pseudo inconnu'
            }
          })
        } else if (!res.data.status.passwordValide) { // Je teste si le mot de passe et valide
          this.setState({
            password: {
              value: password.value,
              warning: 'mot de passe invalide'
            }
          })
        } else {
          console.log(`Bienvenue ${res.data.user.pseudo}`)
          // Envoi de l'id
          this.props.setToken(res.data.user.token)
          this.props.setId(res.data.user.id)
          this.props.setLoginValidity(true)
        }
      })
    }
  }

  render() {
    const { pseudo, password } = this.state
    return (
      <div className="connection">
        <form className="connection-form" onSubmit={this.submitLoginUser}>
          <div className="connectionToolHeader">
            <div className="connectionToolHeader-title">
              Collaps
            </div>
            <div className="connectionToolHeader-subtitle">
              Bienvenue dans l'espace de connexion
            </div>
          </div>
          <div className="connection-body scroller">
            <div className="connection-body-input">
              <div className="title">
                Pseudo {pseudo.warning ? <span className="title-warning">- {pseudo.warning}</span> : null}
              </div>
              <input
                className={`input ${pseudo.warning ? 'input-warning' : ''}`}
                type="text"
                autoFocus
                value={pseudo.value}
                onChange={this.handleChangeInputPseudo}
              />
              <div className="spacer"></div>
              <div className="title">
                Mot de passe {password.warning ? <span className="title-warning">- {password.warning}</span> : null}
              </div>
              <input
                className={`input ${password.warning ? 'input-warning' : ''}`}
                type="password"
                value={password.value}
                onChange={this.handleChangeInputPassword}
              />
              <div className="link"><a href="https://google.com">Tu as oublié ton mot de passe ?</a></div>
            </div>
          </div>
          <div className="connectionToolFooter">
            <div className="connectionToolFooter-btn">
              <button className="btn-text-default" type="submit">
                <div className="content">Se connecter</div>
              </button>
              <button className="btn-text-simple" type="button" onClick={this.props.hide}>
                <div className="content">S'inscrire</div>
              </button>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

export default Register