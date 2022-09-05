import React, { Component } from 'react'
import ReactDOM from "react-dom";

import api from "../../../api"
const { validityPseudo } = require("../../../functions/validity.js");

export default class Setting extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedFiles: [],
      pseudo: {
        value: 'x',
        warning: '',
        valid: false
      }
    }

    // Cette liaison est nécéssaire afin de permettre
    // l'utilisation de `this` dans la fonction de rappel.
    this.handleLogOutUser = this.handleLogOutUser.bind(this);
    this.handleUpdateUser = this.handleUpdateUser.bind(this);
    this.resetAndHide = this.resetAndHide.bind(this);
  }

  // onChange management

  // Avatar
  handleChangeInputAvatar = async event => {

    // .jpg,.jpeg,.png,.gif

    const files = event.target.files
    const avatar = files[0]
    const type = /image.*/

    if (!avatar.type.match(type)) return

    //if (avatar.size > (100*1024)) return

    this.setState({
      selectedFiles: files
    });
  }

  // Pseudo
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

  // Submit management

  // Nettoyage du 'State' et fermeture
  resetAndHide() {
    this.setState({
      selectedFiles: [],
      pseudo: {
        value: 'x',
        warning: '',
        valid: false
      }
    })

    this.props.hide()
  }

  // Déconnection du client
  handleLogOutUser() {
    this.props.storageLocal.setId("")
    this.props.storageLocal.setToken("")
    this.props.storageLocal.setLoginValidity(false)
  }

  // Mise à jour des modifications du client
  handleUpdateUser() {

    // UploadAvatar // https://github.com/MaksymRudnyi/turorials/
    if (this.state.selectedFiles.length !== 0) {
      // FormData permet de stocker plusieur fichiers à la fois
      const file = new FormData();
      // Ajoute le fichier au "formData" avec la fonction "append"
      file.append('avatar', this.state.selectedFiles[0]);

      api.uploadFileAvatar(this.props.client.id, this.props.client.token, file)//file
        .then((res) => {
          console.log('Upload Success')
        })
        .catch((err) => {
          console.log(err)
          console.log('Upload Error')
        })
    }

    // UploadPseudo
    const { pseudo } = this.state
    if (pseudo.valid === true) {

      // Requête a l'api pour rechercher le pseudo
      api.getUserByPseudo(pseudo.value).then(res => {

        // Je vérifie si le pseudo est déjà utilisé
        if (res.data.user) {
          this.setState({
            pseudo: {
              value: pseudo.value,
              warning: 'ce pseudo est déjà utilisé'
            }
          })
        } else {

          this.resetAndHide()
          // Mise à jour de l'utilisateur
          api.updateUserById(this.props.client.id, { pseudo: pseudo.value }).then(
            (res) => {
              console.log("Mise à jour de l'utilisateur")
            },
            (error) => {
              console.log("Problème d'enregistrement dans la base de données")
              console.log(error)
            })
        }
      })
    } else {
      if (pseudo.value.length === 0) {
        this.setState({
          pseudo: {
            value: pseudo.value,
            warning: 'Ne peut être vide'
          }
        })
      } else {
        this.resetAndHide()
      }
    }
  }

  render() {
    const { pseudo, selectedFiles } = this.state
    // Récupération des données du client dans l’état local
    const client = this.props.client

    return (
      this.props.isShowing
        ? ReactDOM.createPortal(
          <div className="window">
            <div className="window-backdrop" onClick={this.props.hide}></div>
            <form className="window-container">
              <div className="windowToolHeader">
                <div className="windowToolHeader-title">
                  Paramètres
                </div>
                <div className="windowToolHeader-subtitle">
                  Clic sur ton pseudo pour le modifier
                </div>
              </div>
              <div className="clientSetting-body scroller">
                <div className="clientSetting-body-divider">
                  <div className="title">Compte</div><div className="bar"></div>
                </div>

                <div className="clientSetting-body-account">
                  <div className="clientSetting-body-account-avatar">
                    <img className="avatar" src={selectedFiles.length === 0 ? client === null ? null : `${client.avatar_url}${client.id}` : URL.createObjectURL(selectedFiles[0])}
                      alt="user account" />
                    <input className="avatarUploaderInput" type="file" accept=".jpg,.jpeg,.png,.gif" onChange={this.handleChangeInputAvatar} />
                    <div className="avatarUploaderIcon"></div>
                  </div>
                  <div className="clientSetting-body-account-info">
                    <div className="pseudo">
                      <div className="title">Pseudo {pseudo.warning ? <span className="title-warning">- {pseudo.warning}</span> : null}</div>
                      <div className="content">
                        <input
                          className="input"
                          type="text"
                          maxLength="32"
                          required
                          value={pseudo.value === "x" ? client === null ? null : client.pseudo : pseudo.value}
                          onChange={this.handleChangeInputPseudo}
                        />
                      </div>
                    </div>
                    <div className="id">
                      <div className="title">Id</div>
                      <div className="content">{client.id}</div>
                    </div>
                  </div>
                </div>

                <div className="clientSetting-body-divider">
                  <div className="title">Informations</div><div className="bar"></div>
                </div>

                <div className="clientSetting-body-info">
                  <div className="clientSetting-body-info-compatibility">
                    <div className="title">Compatible</div>
                    <div className="navigator">
                      <li>Mozilla Firefox</li>
                      <li>Google Chrome</li>
                      <li>Apple Safari</li>
                      <li>Microsoft Edge</li>
                    </div>
                  </div>
                  <div className="clientSetting-body-info-support">
                    <div className="title">Support</div>
                    <div className="navigator">
                      <li>Windows</li>
                      <li>MacOS</li>
                      <li>Android</li>
                      <li>iOS</li>
                    </div>
                  </div>
                </div>

              </div>
              <div className="windowToolFooter">
                <button className="btn-icon-default-red" type="button" onClick={this.handleLogOutUser}>
                  <svg viewBox="0 0 384 384" aria-hidden="false" width="21" height="21" x="0" y="0">
                    <path fill="currentColor" d="M341.333,0H42.667C19.093,0,0,19.093,0,42.667V128h42.667V42.667h298.667v298.667H42.667V256H0v85.333
                      C0,364.907,19.093,384,42.667,384h298.667C364.907,384,384,364.907,384,341.333V42.667C384,19.093,364.907,0,341.333,0z"/>
                    <polygon fill="currentColor" points="151.147,268.48 181.333,298.667 288,192 181.333,85.333 151.147,115.52 206.293,170.667 0,170.667 0,213.333 
                      206.293,213.333" />
                  </svg>
                </button>
                <div className="windowToolFooter-btn">
                  <button className="btn-text-default" type="button" onClick={this.handleUpdateUser}>
                    <div className="content">Terminé</div>
                  </button>
                  <button className="btn-text-simple" type="button" onClick={this.resetAndHide}>
                    <div className="content">Annuler</div>
                  </button>
                </div>
              </div>
            </form>
          </div>,
          document.body
        ) : null
    )
  }
}

/*
{selectedFiles.length == 0 ? "rien" : <img style={{maxWidth: '200px'}} src={URL.createObjectURL(selectedFiles[0])} alt={selectedFiles[0].originalname}/>}
{selectedFiles.length == 0 ? "rien" : selectedFiles.map((file) => <img style={{maxWidth: '200px'}} src={`//localhost:8000/${file.filename}`} alt={file.originalname}/>)}

*/