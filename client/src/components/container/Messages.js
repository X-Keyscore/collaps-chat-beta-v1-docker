import React from 'react';

export default function Messages({ client, selectedChannel, messagesChannels }) {

  const messagesPast = selectedChannel.messages
  
  const messagesLive = messagesChannels.length === 0 ? [] :
  messagesChannels.find(messagesChannel => messagesChannel.id === selectedChannel.id) === undefined ? [] :
  messagesChannels.find(messagesChannel => messagesChannel.id === selectedChannel.id).messages

  // Jonction des messages de la base de données et des messages en direct
  const MessagesArr = messagesPast.concat(messagesLive);

  // Open message file
  function handleOpenFile(id) {
    window.open("http://localhost:3000/api/file/get/files/" + id, "_blank");
  }

  return (
    MessagesArr.map((message, index) => {
      // Récupération du pseudo
      const pseudo = message.sender === client.id ? client.pseudo : selectedChannel.recipients.find(recipient => recipient.id === message.sender).pseudo

      return (
        <div className="message-body-message parents" key={index}>
          <div className="message-body-message-avatar">
            <img className="avatar"
              src={`${client.avatar_url}${message.sender}`}
              alt="user profil" />
          </div>
          <h2 className="message-body-message-header">
            <span className="pseudo">
              {pseudo}
            </span>
            <span className="timestamp">
              {message.date}
            </span>
          </h2>
          {
            message.file == null ? null :
              <div onClick={() => handleOpenFile(message.file)} className="message-body-message-file">
                <svg className="icon" viewBox="0 0 512 512" width="24" height="24" x="0" y="0">
                  <g fill="currentColor" stroke="none" transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)">
                    <path d="M1150 4671 c-30 -9 -73 -29 -95 -43 -53 -33 -128 -115 -155 -168 -51
                      -100 -50 -48 -50 -1900 0 -1853 -1 -1800 50 -1901 28 -54 111 -142 164 -173
                      101 -59 25 -57 1517 -54 l1364 3 58 23 c72 29 172 120 210 191 58 106 57 70
                      57 1496 0 794 -4 1333 -10 1369 -5 32 -23 88 -40 125 -28 61 -69 104 -488 522
                      -422 422 -462 459 -527 490 l-70 34 -965 2 c-901 2 -969 1 -1020 -16z m1928
                      -315 c15 -8 215 -203 444 -433 360 -362 417 -423 423 -455 4 -20 4 -41 0 -47
                      -4 -7 -96 -11 -278 -11 -291 0 -366 9 -448 50 -54 28 -142 111 -173 164 -51
                      88 -56 126 -56 448 l0 298 30 0 c17 0 43 -6 58 -14z m419 -1662 c98 -73 98
                      -195 0 -268 -28 -21 -31 -21 -937 -21 -906 0 -909 0 -937 21 -89 66 -99 179
                      -21 251 12 12 34 26 48 32 16 6 340 9 922 8 893 -2 897 -2 925 -23z m0 -640
                      c98 -73 98 -195 0 -268 -28 -21 -31 -21 -937 -21 -906 0 -909 0 -937 21 -89
                      66 -99 179 -21 251 12 12 34 26 48 32 16 6 340 9 922 8 893 -2 897 -2 925 -23z
                      m0 -640 c98 -73 98 -195 0 -268 -28 -21 -31 -21 -937 -21 -906 0 -909 0 -937
                      21 -89 66 -99 179 -21 251 12 12 34 26 48 32 16 6 340 9 922 8 893 -2 897 -2
                      925 -23z"/>
                  </g>
                </svg>
                <div className="title">
                  Ouvrir
                </div>
              </div>
          }
          <div className="message-body-message-text">
            {message.text}
          </div>
        </div>
      )
    })
  )
}