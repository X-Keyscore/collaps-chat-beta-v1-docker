import React, { Component } from 'react'
import api from '../../api'

const { validityPseudo, validityPassword, validityPasswordConfirm, validityPasswordConfirmForPassword } = require("../../functions/validity.js");

class Register extends Component {
  constructor(props) {
    super(props)

    this.state = {
      pseudo: {
        value: '',
        warning: '',
        valid: false
      },
      password: {
        value: '',
        warning: '',
        valid: false
      },
      passwordConfirm: {
        value: '',
        warning: '',
        valid: false
      }
    }
  }

  // Passe la valeur du "input" "pseudo" à l'état local
  handleChangeInputPseudo = async event => {
    const pseudo = event.target.value
    const rep = validityPseudo(pseudo);
    this.setState({
      pseudo: {
        value: pseudo,
        warning: rep.warning,
        valid: rep.valid
      }
    })
  }

  // Passe la valeur de "input" "password" à l'état local
  handleChangeInputPassword = async event => {
    const password = event.target.value;
    const rep = validityPassword(password);
    this.setState({
      password: {
        value: password,
        warning: rep.warning,
        valid: rep.valid
      }
    })

    const passwordConfirm = this.state.passwordConfirm;
    const rep2 = validityPasswordConfirmForPassword(passwordConfirm, password);
    this.setState({
      passwordConfirm: {
        value: passwordConfirm.value,
        warning: rep2.warning,
        valid: rep2.valid
      }
    })
  }

  // Passe la valeur de "input" "passwordConfirm" à l'état local
  handleChangeInputPasswordConfirm = async event => {
    const passwordConfirm = event.target.value;
    const rep = validityPasswordConfirm(passwordConfirm, this.state.password.value);
    this.setState({
      passwordConfirm: {
        value: passwordConfirm,
        warning: rep.warning,
        valid: rep.valid
      }
    })
  }

  // Soumission du formulaire
  submitCreateUser = async (e) => {
    e.preventDefault()

    const { pseudo, password, passwordConfirm } = this.state
    if (pseudo.valid === true && password.valid === true && passwordConfirm.valid === true) {

      // Requête a l'api pour rechercher le pseudo
      await api.getUserByPseudo(pseudo.value).then(res => {

        // Je vérifie si le pseudo est déjà utilisé
        // sinon on crée l'utilisateur
        if (res.data.user) {
          this.setState({
            pseudo: {
              value: pseudo.value,
              warning: 'ce pseudo est déjà utilisé'
            }
          })
        } else {

          // Création de l'utilisateur
          const id = (Math.floor(Math.random() * 10000000000000000) + 99999999999999999).toString();
          const payload = {
            id,
            pseudo: pseudo.value,
            password: password.value,
            channels: []
          }
          api.registeringUser(payload).then(
            (res) => {
              // Envoi de l'id si l'utilisateur est créé
              if (res.data.status.success) {
                this.props.setToken(res.token)
                this.props.setId(id)
                this.props.setLoginValidity(true)
              }
            },
            (err) => {
              console.log(err)
            })
        }
      })
    }
  }

  render() {
    const { pseudo, password, passwordConfirm } = this.state

    return (
      <div className="connection">
        <form className="connection-form" onSubmit={this.submitCreateUser}>
          <div className="connectionToolHeader">
            <div className="connectionToolHeader-title">
              Collaps
            </div>
            <div className="connectionToolHeader-subtitle">
              Bienvenue dans l'espace d'inscription
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
                required
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
                required
                value={password.value}
                onChange={this.handleChangeInputPassword}
              />
              <div className="spacer"></div>
              <div className="title">
                Confirmer le mot de passe {passwordConfirm.warning ? <span className="title-warning">- {passwordConfirm.warning}</span> : null}
              </div>
              <input
                className={`input ${passwordConfirm.warning ? 'input-warning' : ''}`}
                type="password"
                required
                value={passwordConfirm.value}
                onChange={this.handleChangeInputPasswordConfirm}
              />
            </div>
          </div>
          <div className="connectionToolFooter">
            <div className="connectionToolFooter-btn">
              <button className="btn-text-default" type="submit">
                <div className="content">S'inscrire</div>
              </button>
              <button className="btn-text-simple" type="button" onClick={this.props.hide}>
                <div className="content">Se connecter</div>
              </button>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

export default Register