import { EveBannedCharacterAttributes, EveCharacterAttributes } from "../../../../web/models/eve/character"
import { AllowedAlliancesAttributes } from "../../../../web/models/eve/alliance"
import { AllowedCorporationsAttributes } from "../../../../web/models/eve/corporation"
import { InvTypesAttributes } from "../../../../web/models/eve/invtypes"
import { InvMarketGroupsAttributes } from "../../../../web/models/eve/invmarketgroups"
import { SettingsAttributes } from "../../../../web/models/eve/settings"
import Navigation from "../Navigation"
import UserPanel from "./UserPanel"
import FreighterPanel from "./FreighterPanel"
import AlliancePanel from "./AlliancePanel"
import CorporationPanel from "./CorporationPanel"
import ItemTypePanel from "./ItemTypePanel"
import MarketGroupPanel from "./MarketGroupPanel"
import SettingsPanel from "./SettingsPanel"
import DestinationsPanel from "./DestinationsPanel"
import { useState, useEffect, MouseEvent } from "react"
import fetchJson from "../../fetch"

export interface DirectorJson {
    character: EveCharacterAttributes
    title: string,
    active: string,
    bannedUsers: EveBannedCharacterAttributes[],
    freighters: EveCharacterAttributes[],
    allowedAlliances: AllowedAlliancesAttributes[],
    allowedCorporations: AllowedCorporationsAttributes[],
    bannedItemTypes: InvTypesAttributes[],
    bannedMarketGroups: InvMarketGroupsAttributes[],
    settings: SettingsAttributes
}

function show(e: MouseEvent, id: string): void {
    document.querySelectorAll("ul.nav.nav-tabs.nav-justified li").forEach(element => {
        element.classList.remove("active")
    })

    const header = e.currentTarget
    header.parentElement!.classList.add("active")

    document.querySelectorAll("form").forEach(element => {
        if (element.parentElement instanceof HTMLDivElement) {
            element.parentElement.style.display = "none"
        }
    })

    document.getElementById(id)!.style.display = "block"
}

export default function Director() {
    const [director, setDirector] = useState<DirectorJson>()

    useEffect(() => {
        const fetchData = async () => await fetchJson("/director", setDirector)
        fetchData()
    }, [])

    return <>
    <Navigation director={true}/>
    <div className="jumbotron">
        <div className="container">
            <h1>Mango Deliveries</h1>
            <p>Director Panel</p>
        </div>
    </div>
    <div className="container">
        <div id="submit-alert" className="alert" role="alert">
            <p style={{whiteSpace: "pre-wrap"}}></p>
        </div>
        <ul className="nav nav-tabs nav-justified">
            <li key="user">
                <a onClick={e => show(e, "user-panel")}>Users</a>
            </li>
            <li key="freighter">
                <a onClick={e => show(e, "freighter-panel")}>Freighters</a>
            </li>
            <li key="alliance">
                <a onClick={e => show(e, "alliance-panel")}>Alliances</a>
            </li>
            <li key="corporation">
                <a onClick={e => show(e, "corporation-panel")}>Corporations</a>
            </li>
            <li key="item-type">
                <a onClick={e => show(e, "item-type-panel")}>Item Types</a>
            </li>
            <li key="market-group">
                <a onClick={e => show(e, "market-group-panel")}>Market Groups</a>
            </li>
            <li key="settings">
                <a onClick={e => show(e, "settings-panel")}>Settings</a>
            </li>
            <li key="destinations">
                <a onClick={e => show(e, "destinations-panel")}>Destinations</a>
            </li>
        </ul>
        <UserPanel bannedUsers={director?.bannedUsers}/>
        <FreighterPanel freighters={director?.freighters}/>
        <AlliancePanel allowedAlliances={director?.allowedAlliances}/>
        <CorporationPanel allowedCorporations={director?.allowedCorporations}/>
        <ItemTypePanel bannedItemTypes={director?.bannedItemTypes}/>
        <MarketGroupPanel bannedMarketGroups={director?.bannedMarketGroups}/>
        <SettingsPanel settings={director?.settings}/>
        <DestinationsPanel />
    </div>
    </>
}