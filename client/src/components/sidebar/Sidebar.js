import React, { Component } from 'react'

import ChannelsContacts from './ChannelsContacts'
import ChannelsGroupes from './ChannelsGroupes'

import NewContact from "./NewContact";
import NewGroupe from "./NewGroupe";
import Setting from "./windows/setting";

import userContext from '../../contexts/UserProvider';

export default class Sidebar extends Component {
	static contextType = userContext
	constructor(props) {
		super(props)
		this.state = {
			isShowingNewContact: false,
			isShowingNewGroupe: false,
			isShowingSetting: false
		}
	}

	toggleNewContact = () => {
		this.state.isShowingNewContact ? this.setState({ isShowingNewContact: false }) : this.setState({ isShowingNewContact: true })
	}
	toggleNewGroupe = () => {
		this.state.isShowingNewGroupe ? this.setState({ isShowingNewGroupe: false }) : this.setState({ isShowingNewGroupe: true })
	}
	toggleSetting = () => {
		this.state.isShowingSetting ? this.setState({ isShowingSetting: false }) : this.setState({ isShowingSetting: true })
	}

	// Fonction appelée quand le client commence à écrire
	searchSystem = () => {
		// Declare variables
		var input, filter, ul, li, a, i, txtValue;
		input = document.getElementById('myInput');
		filter = input.value.toUpperCase();
		ul = document.getElementById("channelsPrivates");
		li = ul.getElementsByTagName("button")

		// Parcoure tous les éléments de la liste et masquez ceux qui ne correspondent pas à la requête de recherche
		for (i = 0; i < li.length; i++) {
			a = li[i].getElementsByClassName("overflow")[0];
			if (a === undefined) return console.log("test")
			txtValue = a.textContent || a.innerText;
			if (txtValue.toUpperCase().indexOf(filter) > -1) {
				li[i].style.display = "";
			} else {
				li[i].style.display = "none";
			}
		}
	}

	// Fonction utilisé pour copier l'id du client en bas de la "sidebar"
	copyId = () => {
		const client = this.context.client
		navigator.clipboard.writeText(client == null ? null : client.id).then(
			() => {
				console.log("Id copier")
			},
			(error) => {
				console.log("Nous n'avons pas pu copier votre id")
				console.log(error)
			});
	}

	render() {
		// Récupération des données du client dans l’état local
		const client = this.context.client

		return (
			<div className="sidebar">
				<div className="sidebar-header">
					<input className="sidebar-header-search" type="text" id="myInput" onKeyUp={this.searchSystem} placeholder="Rechercher une conversation" />
				</div>
				<div className="sidebar-body scroller">

					<div className="title">
						<span className="text">Contacts</span>
						<button className="button" type="button" aria-label="Créer un contact" onClick={this.toggleNewContact}>
							<svg x="0" y="0" aria-hidden="false"
								width="24" height="24" viewBox="0 0 18 18">
								<polygon fillRule="nonzero" fill="currentColor" points="15 10 10 10 10 15 8 15 8 10 3 10 3 8 8 8 8 3 10 3 10 8 15 8"></polygon>
							</svg>
						</button>
					</div>
					<div id="channelsPrivates" aria-label="Salons privés">
						<NewContact isShowing={this.state.isShowingNewContact} hide={this.toggleNewContact} storageLocal={this.props.storageLocal} />
						<ChannelsContacts />
					</div>
					<div className="title" id="channelsGroupesTitle">
						<span className="text">Groupes</span>
						<button className="button" type="button" aria-label="Créer un groupe" onClick={this.toggleNewGroupe}>
							<svg x="0" y="0" aria-hidden="false"
								width="24" height="24" viewBox="0 0 18 18">
								<polygon fillRule="nonzero" fill="currentColor" points="15 10 10 10 10 15 8 15 8 10 3 10 3 8 8 8 8 3 10 3 10 8 15 8"></polygon>
							</svg>
						</button>
					</div>
					<div id="channelsGroupes" aria-label="Salons de groupes">
						<NewGroupe isShowing={this.state.isShowingNewGroupe} hide={this.toggleNewGroupe} />
						<ChannelsGroupes />
					</div>

				</div>

				<div className="sidebar-footer">
					<div className="sidebar-footer-panels" aria-label="Zone utilisateur">
						<div className="sidebar-footer-panels-avatar">
							<svg width="40" height="32" viewBox="0 0 40 32" aria-hidden="true">
								<foreignObject x="0" y="0" width="32" height="32">
									<img className="avatar" src={client == null ? null : `${client.avatar_url}${client.id}`} aria-hidden="true" alt="" />
								</foreignObject>
								<rect className={client == null ? null : client.activity === "online" ? "online" : "offline"} fill="currentColor" width="10" height="10" x="22" y="22" rx="15" ry="15"></rect>
							</svg>
						</div>
						<div className="sidebar-footer-panels-info" onClick={this.copyId}>
							<div className="username">
								<div className="overflow">{client == null ? null : client.pseudo}</div>
							</div>
							<div className="tag">
								<div className="overflow">{client == null ? null : client.id}</div>
							</div>
						</div>
						<div className="sidebar-footer-panels-control">
							<button className="btn-icon-small" type="button" alt="Bouton paramètre" onClick={this.toggleSetting}>
								<svg viewBox="0 0 24 24" aria-hidden="false" width="17" height="17" x="0" y="0">
									<path fill="currentColor"
										d="m22.683 9.394-1.88-.239c-.155-.477-.346-.937-.569-1.374l1.161-1.495c.47-.605.415-1.459-.122-1.979l-1.575-1.575c-.525-.542-1.379-.596-1.985-.127l-1.493
									1.161c-.437-.223-.897-.414-1.375-.569l-.239-1.877c-.09-.753-.729-1.32-1.486-1.32h-2.24c-.757 0-1.396.567-1.486 1.317l-.239
									1.88c-.478.155-.938.345-1.375.569l-1.494-1.161c-.604-.469-1.458-.415-1.979.122l-1.575 1.574c-.542.526-.597 1.38-.127 1.986l1.161
									1.494c-.224.437-.414.897-.569 1.374l-1.877.239c-.753.09-1.32.729-1.32 1.486v2.24c0 .757.567 1.396 1.317 1.486l1.88.239c.155.477.346.937.569
									1.374l-1.161 1.495c-.47.605-.415 1.459.122 1.979l1.575 1.575c.526.541 1.379.595 1.985.126l1.494-1.161c.437.224.897.415 1.374.569l.239
									1.876c.09.755.729 1.322 1.486 1.322h2.24c.757 0 1.396-.567 1.486-1.317l.239-1.88c.477-.155.937-.346 1.374-.569l1.495 1.161c.605.47
									1.459.415 1.979-.122l1.575-1.575c.542-.526.597-1.379.127-1.985l-1.161-1.494c.224-.437.415-.897.569-1.374l1.876-.239c.753-.09 1.32-.729
									1.32-1.486v-2.24c.001-.757-.566-1.396-1.316-1.486zm-10.683 7.606c-2.757 0-5-2.243-5-5s2.243-5 5-5 5 2.243 5 5-2.243 5-5 5z" />
								</svg>
							</button>
							<Setting isShowing={this.state.isShowingSetting} hide={this.toggleSetting} client={client} storageLocal={this.props.storageLocal} />
						</div>
					</div>
				</div>

			</div>
		)
	}
}