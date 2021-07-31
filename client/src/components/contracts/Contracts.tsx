import { ChangeEvent, useEffect, useState } from "react"
import { ContractsResponse } from "../../../../web/controllers/eve.js"
import fetchJson from "../../fetch"
import Navigation from "../Navigation"
import PendingContracts from "./PendingContracts"
import OngoingContracts from "./OngoingContracts"
import FinalizedContracts from "./FinalizedContracts"

async function submit(): Promise<void> {
    const accept: string[] = []

    document.querySelectorAll("input[name=accept]:checked").forEach((element, index) => {
        accept.push(element.getAttribute("contract")!)
    })

    const flag: string[] = []
    document.querySelectorAll("input[name=flag]:checked").forEach((element, index) => {
        flag.push(element.getAttribute("contract")!)
    })

    const complete: string[] = []
    document.querySelectorAll("input[name=complete]:checked").forEach((element, index) => {
        complete.push(element.getAttribute("contract")!)
    })

    const tax: string[] = []
    document.querySelectorAll("input[name=tax]:checked").forEach((element, index) => {
        tax.push(element.getAttribute("contract")!)
    })

    await fetch("/contracts/submit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            accept: accept,
            flag: flag,
            complete: complete,
            tax: tax
        })
    }).then(window.location.reload).catch(res => {
        if (!res.alert) {
            window.location.reload()
            return
        }

        const submitAlert = document.getElementById("submit-alert")!
        submitAlert.classList.remove("alert-success")
        submitAlert.classList.add("alert-danger")
        submitAlert.innerText = res.alert

        if (!(submitAlert.parentElement instanceof HTMLAnchorElement)) {
            return
        }

        submitAlert.innerHTML = "<a href='javascript:window.location.reload()'></a>"
    })
}

function show(listId: string, contractsId: string): void {
    const list = document.getElementById(listId)!
    if (list.classList.contains("disabled")) {
        return
    }

    document.querySelectorAll("ul.nav.nav-tabs.nav-justified li").forEach((element, index) => {
        element.classList.remove("active")
    })

    list.classList.add("active")
    document.querySelectorAll<HTMLElement>("div.table-responsive").forEach((element, index) => {
        element.style.display = "none"
    })

    document.getElementById(contractsId)!.style.display = "block"
}

export default function Contracts() {
    const [contracts, setContracts] = useState<ContractsResponse>()
    const [pendingString, setPendingString] = useState("")
    const [ongoingString, setOngoingString] = useState("")
    const [finalizedString, setFinalizedString] = useState("")
    const [tax, setTax] = useState(0)

    useEffect(() => {
        const fetchData = async () => await fetchJson("/contracts", setContracts)
        fetchData()
    }, [])

    useEffect(() => {
        if (!contracts?.pending || contracts.pending.length === 0) {
            setPendingString("There are no pending contracts left")
        } else {
            setPendingString(contracts.pending.length === 1
                ? "There is 1 pending contract left"
                : `There are ${contracts.pending.length} pending contracts left`)
        }

        if (!contracts?.ongoing || contracts.ongoing.length === 0) {
            setOngoingString("There are no currently ongoing contracts")
        } else {
            setOngoingString(contracts.ongoing.length === 1
                ? "There is 1 currently ongoing contract"
                : `There are ${contracts.ongoing.length} currently ongoing contracts`)
        }

        if (!contracts?.finalized || contracts.finalized.length === 0) {
            setFinalizedString("There are no finalized contracts")
        } else {
            setFinalizedString(contracts.finalized.length === 1
                ? "There is 1 finalized contract"
                : `There are ${contracts.finalized.length} finalized contracts`)
        }
    }, [contracts])

    const updateTax = (e: ChangeEvent<HTMLInputElement>) => {
        let change = e.target.valueAsNumber * 0.03

        if (!e.target.checked) {
            change = -change
        }

        setTax(old => old += change)
    }

    return <>
    <Navigation contracts={true}/>
    <div className="jumbotron">
        <div className="container">
            <h1>Mango Deliveries</h1>
            <div className="col-md-6">
                <div className="row">
                    <p>{pendingString}</p>
                    <p>{ongoingString}</p>
                    <p>{finalizedString}</p>
                </div>
            </div>
            <div className="col-md-6">
                <div className="col-md-6 pull-right">
                    <div className="form-group">
                        <div className="row">
                            <label htmlFor="tax">Tax (3%)</label>
                            <div className="input-group">
                                <input className="pull-right form-control" name="tax" type="text" id="tax" value={tax} autoComplete="off" readOnly={true}></input>
                                <div className="input-group-addon">ISK</div>
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="text-center">
                            <button className="btn btn-primary" type="submit" onClick={submit}>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div className="container">
        <div id="submit-alert" className="alert"></div>
        <ul className="nav nav-tabs nav-justified">
            <li id="pending-contracts-list" key="pending" className={contracts?.pending?.[0] ? "active" : "disabled"}>
                <a onClick={() => show("pending-contracts-list", "pending-contracts")}>Pending Contracts</a>
            </li>
            <li id="ongoing-contracts-list" key="ongoing" className={contracts?.ongoing?.[0] ? undefined : "disabled"}>
                <a onClick={() => show("ongoing-contracts-list", "ongoing-contracts")}>Ongoing Contracts</a>
            </li>
            <li id="finalized-contracts-list" key="finalized" className={contracts?.finalized?.[0] ? undefined : "disabled"}>
                <a onClick={() => show("finalized-contracts-list", "finalized-contracts")}>Finalized Contracts</a>
            </li>
        </ul>
        <PendingContracts freighter={contracts?.freighter} contracts={contracts?.pending} updateTax={updateTax}/>
        <OngoingContracts freighter={contracts?.freighter} contracts={contracts?.ongoing} updateTax={updateTax}/>
        <FinalizedContracts freighter={contracts?.freighter} director={contracts?.director} contracts={contracts?.finalized} updateTax={updateTax}/>
    </div>
    </>
}