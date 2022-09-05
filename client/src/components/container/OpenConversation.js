import React, { useState, useEffect, useRef } from 'react'

import api from '../../api'

import { useUser } from '../../contexts/UserProvider';
import { useChannels } from '../../contexts/ChannelsProvider';

import Messages from "./Messages";

export default function OpenConversation({ storageLocal }) {
  const { client, updateUser } = useUser()
  const { setChannels, selectedChannel, setSelectedChannel, messagesChannels, sendMessage } = useChannels()

  // Ce "state" enregistre le texte du message
  const [textInput, setTextInput] = useState('')
  // Ce "ref" enregistre le fichier du message
  const [fileInput, setFilesInput] = useState(null)

  // Fonction appelée pour supprimer le "channel" selectionné, dans les données du client est dans celle du destinataire
  function handleDelChannel() {

    // J'isole les données du client dans une variable pour pouvoir les modifier
    var userClientEdit = client

    // Je boucle tous les "channels" du client
    for (let i = 0; i < userClientEdit.channels.length; i++) {
      // Je teste si l'id du "channel" sélectionné correspond à l'id du "channel" passé dans la boucle
      if (userClientEdit.channels[i].id === selectedChannel.id) {
        // Je supprime le channel dans la liste grace à sa position
        userClientEdit.channels.splice(i, 1);
        // Je mets à jour le client
        api.updateUserById(userClientEdit.id, { channels: userClientEdit.channels }).then(res => { })
      }
    }

    // Récupération des données du destinataire avec son id
    api.getUserById(selectedChannel.recipients[0].id).then(
      (userRecipient) => {
        // J'isole les données du destinataire dans une variable pour pouvoir les modifier
        var userRecipientEdit = userRecipient.data.user

        // Je boucle tous les "channels" du destinataire
        for (let i = 0; i < userRecipientEdit.channels.length; i++) {
          // Je teste si l'id du "channel" sélectionné correspond à l'id du "channel" passé dans la boucle
          if (userRecipientEdit.channels[i].id === selectedChannel.id) {
            // Je supprime le channel dans la liste grace à sa position
            userRecipientEdit.channels.splice(i, 1);
            // Je mets à jour le destinataire
            updateUser(userRecipientEdit.id, { channels: userRecipientEdit.channels })
          }
        }

      },
      (error) => {
        console.log(error)
      }
    )
    // Supresion du "channel" dans "setChannels"
    setChannels(channels => [
      ...channels.slice(0, selectedChannel.key),
      ...channels.slice(selectedChannel.key + 1)
    ]);
    // Je reset le "setSelectedChannel"
    setSelectedChannel(null)
    // Je supprime le channel
    api.deleteChannelById(selectedChannel.id)
  }

  function handleAddInputFile() {
    let input = document.createElement('input');
    input.type = 'file';
    input.onchange = _ => {
      setFilesInput(input.files)
    };
    input.click();

  }
  
  // Delete selected file
  function handleDeleteInputFile() {
    setFilesInput(null)
  }

  // Fonction appelée pour envoyé un message
  function handleSendMsg(e) {
    e.preventDefault()
    var fileId = null
    if (fileInput !== null) {
      fileId = (Math.floor(Math.random() * 10000000) + 99999999).toString();
      // FormData permet de stocker plusieur fichiers à la fois
      const file = new FormData();
      // Ajoute le fichier au "formData" avec la fonction "append"
      file.append('files', fileInput[0]);
      api.uploadFileMsg(storageLocal.id, storageLocal.token, fileId, file)//file
        .then((res) => {
          console.log(res)
          console.log('Upload Success')
        })
        .catch((err) => {
          console.log(err)
          console.log('Upload Error')
        })
    }

    // channel, text, client
    sendMessage(
      selectedChannel,
      textInput,
      fileId,
      client
    )

    // Reset de "setTextInput"
    setTextInput('')
    setFilesInput(null)
  }

  // Ce script redimensionne le 'textarea' en prenant en compte la taille de l'affichage
  useEffect(() => {
    try {
      // [ Responsive Textarea size ]
      // Je définis la taille maximale du textarea
      var msgTextarea = document.getElementById('msgTextarea');
      if (window.screen.height >= 1000) {
        msgTextarea.style.maxHeight = "330px"//44px = 2 ligne
      } else if (window.screen.height >= 900) {
        msgTextarea.style.maxHeight = "286px"
      } else if (window.screen.height >= 800) {
        msgTextarea.style.maxHeight = "242px"
      } else if (window.screen.height >= 700) {
        msgTextarea.style.maxHeight = "198px"
      } else if (window.screen.height >= 600) {
        msgTextarea.style.maxHeight = "154px"
      } else if (window.screen.height >= 500) {
        msgTextarea.style.maxHeight = "110px"
      }
      // Redimensionnement automatique
      msgTextarea.addEventListener('input', function (event) {
        var el = this;
        el.style.height = '22px';
        el.style.height = (el.scrollHeight - 22) + 'px';
      });
    } catch (error) {
      console.error(error)
    }
  }, []);

  // Met le scroll de "messageBodyScroll" en bas dès qu'un "channel" est sélectionné
  useEffect(() => {
    var scrollarea = document.getElementById('messageBodyScroll');
    const scrollToBottom = (node) => {
      node.scrollTop = node.scrollHeight;
    }
    scrollToBottom(scrollarea);
  }, [selectedChannel]);

  //  Met le scroll de "messageBodyScroll" en bas dès qu'un message et envoyé ou reçu
  useEffect(() => {
    var scrollarea = document.getElementById('messageBodyScroll');
    const scrollToBottom = (node) => {
      node.scrollTop = node.scrollHeight;
    }
    scrollToBottom(scrollarea);
  }, [messagesChannels]);

  var lastSenderNow;

  return (
    
    <div className="message">
      <div className="message-header">
        <div className="message-header-user">
          <div className="message-header-user-avatar">
            <img className="avatar"
              src={`${client.avatar_url}${selectedChannel.recipients[0].id}`}
              alt="user profil" />
          </div>
          <div className="message-header-user-info">
            <div className="username">
              {selectedChannel.recipients[0].pseudo}
            </div>
            <div className="statut online">
              <svg viewBox="0 0 512 512" aria-hidden="false" width="10" height="15" x="0" y="0">
                <path fill="currentColor"
                  d="M256,0C115.39,0,0,115.39,0,256s115.39,256,256,256s256-115.39,256-256S396.61,0,256,0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="message-header-toolbar">
          <button className="btn-icon-small-red" type="button" onClick={handleDelChannel}>
            <svg viewBox="0 0 512 512" aria-hidden="false" width="20" height="20" x="0" y="0">
              <polygon fill="currentColor" points="512,338.954 483.732,310.686 411.772,382.646 339.812,310.686 311.543,338.954 383.503,410.914 311.543,482.874 
              339.812,511.142 411.772,439.182 483.732,511.142 512,482.874 440.04,410.914 		"/>
              <path fill="currentColor" d="M255.858,0.142c-81.562,0-147.918,66.356-147.918,147.918c0,50.52,25.465,95.198,64.226,121.894
              c-36.19,12.488-69.36,33.118-97.227,60.984C26.614,379.265,0,443.516,0,511.858h39.978c0-119.037,96.843-215.88,215.88-215.88
              c81.562,0,147.918-66.355,147.918-147.918C403.776,66.498,337.42,0.142,255.858,0.142z M255.858,256
              c-59.518,0-107.94-48.421-107.94-107.94S196.34,40.12,255.858,40.12c59.518,0,107.94,48.421,107.94,107.94
              S315.376,256,255.858,256z"/>
            </svg>
          </button>
        </div>
      </div>
      <div className="message-body scroller" id="messageBodyScroll">
        {
          client == null ? null :
            <Messages
              client={client}
              selectedChannel={selectedChannel}
              messagesChannels={messagesChannels}
            />
        }
        <div className="message-body-spacer" id="spacer"></div>
      </div>
      <div className="message-footer">
        <form className="message-footer-toolbar" onSubmit={handleSendMsg}>

          <div className="message-footer-toolbar-uploadBtn">
            <svg onClick={handleAddInputFile} className="iconAdd" width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 2.00098C6.486 2.00098 2 6.48698 2 12.001C2 17.515 6.486 22.001 12 22.001C17.514 22.001 22 17.515 22 12.001C22
                    6.48698 17.514 2.00098 12 2.00098ZM17 13.001H13V17.001H11V13.001H7V11.001H11V7.00098H13V11.001H17V13.001Z">
              </path>
            </svg>
            {
              fileInput == null ? null :
                <svg onClick={handleDeleteInputFile} className="iconDelete" viewBox="0 0 512 512" width="24" height="24" x="0" y="0">
                  <g  fill="currentColor" stroke="none" transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)">
                    <path d="M1150 4671 c-30 -9 -73 -29 -95 -43 -53 -33 -128 -115 -155 -168 -51
                    -100 -50 -48 -50 -1900 0 -1853 -1 -1800 50 -1901 28 -54 111 -142 164 -173
                    101 -59 25 -57 1517 -54 l1364 3 58 23 c72 29 172 120 210 191 58 106 57 70
                    57 1496 0 794 -4 1333 -10 1369 -5 32 -23 88 -40 125 -28 61 -69 104 -488 522
                    -422 422 -462 459 -527 490 l-70 34 -965 2 c-901 2 -969 1 -1020 -16z m1928
                    -315 c15 -8 215 -203 444 -433 360 -362 417 -423 423 -455 4 -20 4 -41 0 -47
                    -4 -7 -96 -11 -278 -11 -291 0 -366 9 -448 50 -54 28 -142 111 -173 164 -51
                    88 -56 126 -56 448 l0 298 30 0 c17 0 43 -6 58 -14z m-960 -1712 c23 -9 111
                    -89 239 -217 l203 -201 207 206 c228 225 241 233 344 226 110 -8 189 -93 189
                    -205 0 -29 -7 -70 -15 -90 -10 -22 -93 -114 -217 -240 l-202 -203 201 -203
                    c212 -213 243 -254 243 -332 0 -42 -29 -116 -58 -149 -26 -30 -113 -66 -157
                    -66 -78 1 -119 31 -332 243 l-203 201 -203 -202 c-126 -124 -218 -207 -240
                    -217 -20 -8 -61 -15 -90 -15 -112 0 -197 79 -205 189 -7 103 1 116 226 344
                    l206 207 -206 208 c-225 227 -233 240 -226 343 10 142 160 230 296 173z"/>
                  </g>
                </svg>
            }
          </div>
         

          <textarea id="msgTextarea" className="message-footer-toolbar-textarea scroller" placeholder={"Envoyer un message à " + selectedChannel.recipients[0].pseudo}
            spellCheck="true" autoFocus autoComplete="off"
            value={textInput}
            onChange={e => setTextInput(e.target.value)}
            required
          ></textarea>

          <button className="message-footer-toolbar-sendBtn" type="submit">
            <svg viewBox="0 0 512 512" aria-hidden="false" width="20" height="20">
              <path fill="currentColor" d="M481.508,210.336L68.414,38.926c-17.403-7.222-37.064-4.045-51.309,8.287C2.86,59.547-3.098,78.551,1.558,96.808
                  L38.327,241h180.026c8.284,0,15.001,6.716,15.001,15.001c0,8.284-6.716,15.001-15.001,15.001H38.327L1.558,415.193
                  c-4.656,18.258,1.301,37.262,15.547,49.595c14.274,12.357,33.937,15.495,51.31,8.287l413.094-171.409
                  C500.317,293.862,512,276.364,512,256.001C512,235.638,500.317,218.139,481.508,210.336z" />
            </svg>
          </button>

        </form>
      </div>
    </div>
  )
}