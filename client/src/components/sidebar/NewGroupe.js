import React, { useState } from 'react'
import { useChannels } from '../../contexts/ChannelsProvider'
import { useUser } from '../../contexts/UserProvider';

function NewGroupe({ isShowing, hide }) {
  const { client } = useUser()
  const [selectedContactIds, setSelectedContactIds] = useState([])
  const { createChannel } = useChannels()

  function handleSubmit(e) {
    e.preventDefault()

    createChannel(selectedContactIds)
    // Réinitialisation des valeurs
    setSelectedContactIds([])
    hide()
  }

  function handleCheckboxChange(contactId) {
    setSelectedContactIds(prevSelectedContactIds => {
      if (prevSelectedContactIds.includes(contactId)) {
        return prevSelectedContactIds.filter(prevId => {
          return contactId !== prevId
        })
      } else {
        return [...prevSelectedContactIds, contactId]
      }
    })
  }
  return (
    isShowing
      ?
      <form className="createChannelPrivate" onSubmit={handleSubmit}>
        <div className="createChannelPrivate-header">
          <div className="title">Crée une conversation</div>
        </div>
        <div className="createChannelPrivate-body">
          {
            client == null ? null : client.channels.filter(channel => channel.recipients.length < 2).map((channel) => (
              
              <div key={channel.id}>
                <input
                  type="checkbox"
                  id={channel.id}
                  value={selectedContactIds.includes(channel.recipients[0].id)}
                  onChange={() => handleCheckboxChange(channel.recipients[0].id)}
                />
                <label>{channel.recipients.map(r => r.pseudo).join(', ')}</label>
              </div>
            ))
          }
        </div>
        <div className="createChannelPrivate-footer">
          <button className="btn-text-small" type="submit">Ajouter</button>
        </div>
      </form>
      : null
  )
}
export default NewGroupe;