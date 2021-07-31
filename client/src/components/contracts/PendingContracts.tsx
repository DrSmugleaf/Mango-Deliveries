import { ChangeEvent } from "react"
import { EveContractsAttributes } from "../../../../web/models/eve/contract.js"

export interface PendingContractsProps {
    freighter: boolean | undefined,
    contracts: EveContractsAttributes[] | undefined,
    updateTax: (e: ChangeEvent<HTMLInputElement>) => void
}

export default function PendingContracts(props: PendingContractsProps) {
    return <div id="pending-contracts" className="table-responsive" style={{display: "block"}}>
        <table className="table table-striped">
            <thead>
                <tr>
                    <th># (Link)</th>
                    <th>Destination</th>
                    {props.freighter && <th>Customer</th>}
                    <th>Price</th>
                    <th>Quote</th>
                    <th>Multiplier</th>
                    <th>Volume</th>
                    <th>ISK/m³</th>
                    <th>Submitted</th>
                    {props.freighter &&
                    <>
                        <th>Accept</th>
                        <th>Flag</th>
                    </>}
                </tr>
            </thead>
            <tbody>
                {props.contracts?.map(contract =>
                    <tr className={contract.status}>
                        <td>
                            <a href={contract.link}>{contract.id}</a>
                        </td>
                        <td>{contract.destination}</td>
                        {props.freighter &&
                        <td>{contract.submitterName}</td>}
                        <td>{contract.valueShort}</td>
                        <td>{contract.quoteFormatted}</td>
                        <td>{contract.multiplier}</td>
                        <td>{contract.volumeFormatted}</td>
                        <td>{contract.valueVolumeRatioFormatted}</td>
                        <td>{contract.submittedFormatted}</td>
                        {props.freighter &&
                        <>
                        <td>
                            <input type="checkbox" name="accept" value={contract.value} data-contract={contract.id} onChange={props.updateTax}></input>
                        </td>
                        <td>
                            {contract.status === "flagged"
                            ? <input type="checkbox" name="flag" value={contract.value} data-contract={contract.id} onChange={props.updateTax} disabled={true}></input>
                            : <input type="checkbox" name="flag" value={contract.value} data-contract={contract.id} onChange={props.updateTax}></input>}
                        </td>
                        </>}
                    </tr>
                )}
            </tbody>
        </table>
    </div>
}