import React, { useState } from 'react'
import { useUser } from '../../contexts/UserProvider';
import { useChannels } from '../../contexts/ChannelsProvider';

function NewContact({ isShowing, hide, storageLocal }) {
	const { channels, createChannel, setChannels, setSelectedChannel } = useChannels()

	// Création d'un "useState" pour stocker l'id
	const [recipientId, setRecipientId] = useState({
		value: "",
		warning: ""
	})

	async function handleSubmit(e) {
		e.preventDefault()

		const recipient = {
			id: recipientId.value
		}

		// Je teste si la valeur est bien celle d'un id
		if (recipient.id.length === 0) return setRecipientId({
			value: "",
			warning: "Il faut entrer un id"
		})

		// Je teste si la valeur est bien celle d'un id
		if (recipient.id.length !== 18 && !/^[0-9]*$/.test(recipient.id)) return setRecipientId({
			value: "",
			warning: "Ceci n'est pas un id valide"
		})

		// Je test si l'id n'est pas celui du client
		if (recipient.id === storageLocal.id) return setRecipientId({
			value: "",
			warning: "Tu ne peux pas t'ajouter"
		})

		// Je test si le contact n'est pas déjà ajouter
		var valid = true
		channels.filter(channel => channel.type === "private").forEach(channel => {
			if (channel.recipients[0].id === recipient.id) valid = false;
		});
		if (valid === false) return setRecipientId({
			value: "",
			warning: "Ce contact existe déjà"
		});
		
		const newChannel = {
			id: (Math.floor(Math.random() * 10000000000000000) + 99999999999999999).toString(),
			type: "private",
			recipients: [storageLocal.id, recipient.id],
			messages: []
		}

		// Créaction du channel
		const res = await createChannel({
			client: {
				id: storageLocal.id,
				token: storageLocal.token
			},
			recipient: {
				id: recipient.id
			},
			channel: newChannel
		})

		if (res.status.success === false) return setRecipientId({
			value: "",
			warning: res.status.msg
		});
		console.log(res)

		setChannels(channels => [...channels, {
			id: newChannel.id,
			type: newChannel.type,
			recipients: [{
				id: recipient.id
			}],
			messages: []
		}]);

		setSelectedChannel({
			id: newChannel.id,
			type: newChannel.type,
			recipients: [{
				id: recipient.id
			}],
			messages: [],
			key: channels.length === 0 ? 0 : channels.length - 1
		})

		setRecipientId({
			value: "",
			warning: ""
		})
		hide()

	}

	return (
		isShowing
			?
			<>
				<form className="createChannelPrivate" onSubmit={handleSubmit}>
					<div className="createChannelPrivate-header">
						<div className="title">Ajouter un contact</div>
					</div>
					<div className="createChannelPrivate-body">
						{recipientId.warning ? <div className="title-warning">{recipientId.warning} </div> : null}
						<input className="input" type="text" placeholder="ID"
							value={recipientId.value}
							onChange={e => setRecipientId({
								value: e.target.value,
								warning: ""
							})}
						/>
					</div>
					<div className="createChannelPrivate-footer">
						<button className="btn-text-small" type="submit">Ajouter</button>
					</div>
				</form>
			</>
			: null
	)
}
export default NewContact;