import React, { useEffect } from 'react';

import api from "../../api"

import { useUser } from '../../contexts/UserProvider';
import { useChannels } from '../../contexts/ChannelsProvider';

export default function ChannelsContacts() {
  const { client } = useUser()
  const { channels, setChannels, selectedChannel, setSelectedChannel, setMessagesChannels } = useChannels()

  // Le "useEffect" est utilisé pour géré l'asynchrone
  useEffect(() => {

    // Cette fonction renvoie les données du client
    function renderChannels(client) {
      return new Promise((resolve) => {

        // Variable pour stocker les channels du client
        var clientChannels = client.channels

        // Je filtre pour ne récupérer que les contacts privés
        clientChannels.filter(channel => channel.type === "private").forEach((clientChannel, index) => {

          // Je récupère les informations sur le destinataire grace à sont id
          api.getChannelById(clientChannel.id).then((channel) => {

            var channelRecipient = channel.data.channel.recipients.filter(recipient => recipient !== client.id)[0]

            api.getUserById(channelRecipient).then((recipient) => {

              // Si le destinataire n'existe plus je le supprime des données du client et le channel
              if (recipient.data.user === null) {
                // Je boucle tous les "channels" du client
                for (let i = 0; i < client.channels.length; i++) {
                  // Je teste si l'id du "channel" sélectionné correspond à l'id du "channel" passé dans la boucle
                  if (client.channels[i].id === channel.data.channel.id) {
                    // Je supprime le "channel" dans la liste grace à sa position
                    client.channels.splice(i, 1);
                    // Je mets à jour le client
                    api.updateUserById(client.id, { channels: client.channels }).then(res => { })
                    // Je supprime le channel
                    api.deleteChannelById(channel.data.channel.id)
                  }
                }
              }

              // Je complète les informations existantes du destinataire avec celle de la base de données
              var channelEdit = channel.data.channel

              // Ajout des infos sur le desinataire
              channelEdit.recipients = [{
                id: recipient.data.user.id,
                pseudo: recipient.data.user.pseudo
              }]

              // J'ajoute un element "selected" à "channel" est passe la valeur "true" au premier
              Object.assign(channelEdit, { selected: false })
              Object.assign(channelEdit, { key: index })

              // Je mets à jour l'object la list des "channels" du client
              clientChannels[index] = channelEdit

              if (client.channels.length === index + 1) return resolve(clientChannels)

            })
          });
        })
      })
    }

    // Je teste si le client est chargé
    if (client === null) return
    // Je teste si le client à des conversations
    if (client.channels.length === 0) return setChannels([])
    // Fonction asynchrone pour faire le rendu des channels du client
    async function fetchRenderClientChannels() {
      return renderChannels(client).then(channels => setChannels(channels))
    }
    // Appel de la fonction
    fetchRenderClientChannels();
  }, [setChannels, client])

  // Si "client" est "null" c'est qu'il est en chargement donc j'affiche chargement
  if (channels === null) {
    return (
      <div className="sidebar-body-info">Chargement...</div>
    );
  }
  // Si "client.channels" est vide c'est qu'il n'y a pas de constact donc j'affiche aucun contact
  if (channels.length === 0) {
    return (
      <div className="sidebar-body-info">Aucun contact</div>
    );
  }
  return (
    <>
      {
        channels.map((channel) => (
          <button
            key={channel.id}
            className={`sidebar-body-contact ${selectedChannel === null ? null : selectedChannel.id === channel.id ? 'selected' : ''}`}
            onClick={() => {
              // Reset du tableau des messages
              //setMessagesChannels([])
              // Je sélectionne le "channel"
              setSelectedChannel(channel)
            }}
          >
            <div className="sidebar-body-contact-content">
              <div className="sidebar-body-contact-content-avatar">

                <svg width="40" height="32" viewBox="0 0 40 32" aria-hidden="true">
                  <foreignObject x="0" y="0" width="32" height="32">
                    <img className="avatar" src={`${client.avatar_url}${channel.recipients[0].id}`} aria-hidden="true" alt="" />
                  </foreignObject>
                  <rect className="online" fill="currentColor" width="10" height="10" x="22" y="22" rx="15" ry="15"></rect>
                </svg>

              </div>
              <div className="sidebar-body-contact-content-text">
                <div className="username">
                  <div className="overflow">
                    {channel.recipients[0].pseudo}
                  </div>
                </div>
              </div>
            </div>
          </button>
        ))
      }
    </>
  )
}