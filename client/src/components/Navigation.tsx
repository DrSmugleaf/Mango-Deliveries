import { useEffect } from "react"
import { useState } from "react"
import { EveCharacterAttributes } from "../../../web/models/eve/character"
import fetchJson from "../fetch"

export interface NavigationProps {
    home?: boolean,
    contracts?: boolean,
    director?: boolean
}

function isActive(active: boolean | undefined): string | undefined {
    return active ? "active" : undefined
}

export default function Navigation(props: NavigationProps) {
    const [character, setCharacter] = useState<EveCharacterAttributes>()

    useEffect(() => {
        const fetchData = async () => await fetchJson("/character", setCharacter, false)
        fetchData()
    }, [])

    return <nav className="navbar navbar-inverse navbar-fixed-top">
        <div className="container">
            <div className="navbar-header">
                <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                    <span className="sr-only">Toggle navigation</span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                </button>
                <a className="navbar-brand" href="/">Mango Deliveries</a>
            </div>
            <div id="navbar" className="navbar-collapse collapse">
                <ul className="nav navbar-nav navbar-left">
                    <li key="home" className={isActive(props.home)}>
                        <a href="/">Home</a>
                        <span className="sr-only"></span>
                    </li>
                    <li key="contracts" className={isActive(props.contracts)}>
                        <a href="/contracts">Contracts</a>
                    </li>
                    {character?.director &&
                    <li key="director" className={isActive(props.director)}>
                        <a href="/director">Director Panel</a>
                    </li>}
                </ul>
                <ul className="nav navbar-nav navbar-right">
                    {character ?
                    <>
                        <li key="name">
                            <a href="/login">{character.characterName}</a>
                        </li>
                        <li key="images">
                            <img src={character.characterPortrait} className="character-image"></img>
                            <img src={character.corporationPortrait} className="character-image"></img>
                            <img src={character.alliancePortrait} className="character-image"></img>
                        </li>
                    </> :
                    <form className="navbar-form navbar-right">
                        <div className="form-group">
                            <a href="/login">
                                <img src="./evessobutton.png"></img>
                            </a>
                        </div>
                    </form>}
                </ul>
            </div>
        </div>
    </nav>
}