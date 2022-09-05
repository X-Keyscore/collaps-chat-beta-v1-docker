import React from 'react'

import Sidebar from './sidebar/Sidebar';

import Welcome from './container/Welcome';
import OpenConversation from './container/OpenConversation';

import { useChannels } from '../contexts/ChannelsProvider';

// Main
export default function Dashboard({ storageLocal }) {
  const { selectedChannel } = useChannels()

  return (
    <>
      <Sidebar storageLocal={storageLocal} />
      <div className="container">
        {
          selectedChannel !== null ? selectedChannel && <OpenConversation storageLocal={storageLocal} /> : <Welcome />
        }
      </div>
    </>
  )
}