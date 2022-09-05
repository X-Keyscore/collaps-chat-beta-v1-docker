import React, { useContext, useState, useEffect, useRef } from 'react'
import { useSocket } from './SocketProvider';
import api from "../api"

const ChannelsContext = React.createContext()

export function useChannels() {
  return useContext(ChannelsContext)
}

export function ChannelsProvider({ storageLocal, children }) {
  const id = storageLocal.id
  const token = storageLocal.token

  const socket = useSocket()
  // https://stackoverflow.com/questions/54824036/useeffect-hook-with-socket-io-state-is-not-persistent-in-socket-handlers
  const [channels, setChannels] = useState(null)
  const channelsRef = useRef(channels);
  useEffect(() => {
    channelsRef.current = channels;
  });

  const [messagesChannels, setMessagesChannels] = useState([])
  const messagesChannelsRef = useRef(messagesChannels);
  useEffect(() => {
    messagesChannelsRef.current = messagesChannels;
  });

  const [selectedChannel, setSelectedChannel] = useState(null)

  useEffect(() => {
    if (socket == null) return

    // channelId, sender, date, text
    const addMessage = (message) => {
      console.log(message)
      // J'isole les "channels" dans une variable
      var allMessages = messagesChannelsRef.current

      // Récuépration de l'index
      const indexMessage = allMessages.findIndex(messagesChannel => messagesChannel.id === message.channelId);

      if (indexMessage !== -1) {
        // Copie de l'ancien tableau de données
        let newArr = [...messagesChannelsRef.current];
        // Ajout du nouveau message
        newArr[indexMessage].messages = [...newArr[indexMessage].messages, { sender: message.sender, date: message.date, text: message.text, file: message.file }];
        // Envoie des données dans le "useState"
        setMessagesChannels(newArr);
      } else {
        // Ajout du message dans le "useState"
        setMessagesChannels(msg => [...msg, { id: message.channelId, messages: [{ sender: message.sender, date: message.date, text: message.text, file: message.file }] }])
      }
    }

    // Si je reçoi un message je l'ajoute dans le "channel" qui lui correspond
    socket.on('receive-message', addMessage);

    return () => socket.off('receive-message', addMessage)
  }, [socket])

  function addMessageToDatabase(message) {
    // Récupération des données du "channel" avec son id
    api.getChannelById(message.channel.id).then(
      (channel) => {

        channel = channel.data.channel

        channel.messages.push({
          sender: message.sender,
          date: message.date,
          text: message.text,
          file: message.file
        })

        api.updateChannelById(channel.id, { data: { messages: channel.messages } }).then(res => { })

      },
      (error) => {
        console.log(error)
      }
    )
  }

  // channel, text, client
  function sendMessage(channel, text, file, client) {

    const addMessage = (message) => {

      // J'isole les message dans une variable
      var allMessages = messagesChannelsRef.current

      // Récupération de l'index dans l'objectif de testé si le "channel" est déjà présent et si oui par la suite lui intégrer le nouveau message grâce a l'intex
      const indexMessage = allMessages.findIndex(messagesChannel => messagesChannel.id === message.channelId);

      if (indexMessage !== -1) {
        // Copie de l'ancien tableau de données
        let newArr = [...messagesChannelsRef.current];
        // Ajout du nouveau message
        newArr[indexMessage].messages = [...newArr[indexMessage].messages, { sender: message.sender, date: message.date, text: message.text, file: message.file }];

        // Envoie des données dans le "useState"
        setMessagesChannels(newArr);
      } else {
        // Ajout du message dans le "useState"
        setMessagesChannels(msg => [...msg, { id: message.channelId, messages: [{ sender: message.sender, date: message.date, text: message.text, file: message.file }] }])
      }
    }

    var date = new Date()
    date = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`

    // channelId, sender, date, text
    addMessage({ channelId: channel.id, sender: client.id, date, text, file })
    // recipients, channelId, sender, date, text
    socket.emit('send-message', { recipients: channel.recipients, channelId: channel.id, sender: client.id, date, text, file })
    // channel, sender, date, text
    addMessageToDatabase({ channel, sender: client.id, date, text, file })

  }

  function createChannel(payload) {
    return new Promise((resolve) => {
      api.insertChannel(payload).then(res => {
        return resolve(res.data)
      })
    })
  }

  const value = {
    channels,
    setChannels,
    messagesChannels,
    setMessagesChannels,
    selectedChannel,
    setSelectedChannel,
    createChannel,
    sendMessage
  }

  return (
    <ChannelsContext.Provider value={value}>
      {children}
    </ChannelsContext.Provider>
  )
}

export default ChannelsContext