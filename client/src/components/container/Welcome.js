import React, { Component } from 'react'

// Main
class Welcome extends Component {
    render() {
        return (
            <div className="welcome">
                <div className="welcome-title">
                    Bienvenue sur Collaps
                </div>
                <div className="welcome-content">
                    Pour ajouter un contact il faut cliquer sur le + a coté de contacts,
                    puis entrer son id et cliquez sur ajouter
                </div>
            </div>
        )
    }
}

export default Welcome