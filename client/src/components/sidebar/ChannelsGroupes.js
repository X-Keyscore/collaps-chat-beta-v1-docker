import React from 'react'
import { useChannels } from '../../contexts/ChannelsProvider';
import { useUser } from '../../contexts/UserProvider';

export default function ChannelsContacts() {
  const { setSelectedChannel } = useChannels()
  const { client } = useUser()

  return (
    <div className="sidebar-body-info">Aucun groupe</div>
  );
  /*
return (
  <>
    { client == null ? null : client.channels.filter(channel => channel.type === "groupe").map((channel) => (
      <button
        key={channel.id}
        className={`sidebar-body-contact ${channel.selected ? 'selected' : ''}`}
        onClick={() => setSelectedChannel(channel)}
      >
        <div className="sidebar-body-contact-content">
          <div className="sidebar-body-contact-content-avatar">

            <svg width="40" height="32" viewBox="0 0 40 32" aria-hidden="true">
              <foreignObject x="0" y="0" width="32" height="32">
                <img className="avatar" src="https://wir.skyrock.net/wir/v1/profilcrop/?c=mog&w=301&h=301&im=%2Fart%2FPRIP.105317501.2.2.jpg" aria-hidden="true" alt="" />
              </foreignObject>
              <rect className="online" fill="currentColor" width="10" height="10" x="22" y="22" rx="15" ry="15"></rect>
            </svg>

          </div>
          <div className="sidebar-body-contact-content-text">
            <div className="username">
              <div className="overflow">
                {channel.recipients.map(r => r.pseudo).join(', ')}
              </div>
            </div>
          </div>
        </div>
      </button>
    ))
    }
  </>
)*/
}
