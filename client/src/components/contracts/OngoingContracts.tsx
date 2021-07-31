import { ChangeEvent } from "react"
import { EveContractsAttributes } from "../../../../web/models/eve/contract.js"

export interface OngoingContractsProps {
    freighter: boolean | undefined
    contracts: EveContractsAttributes[] | undefined,
    updateTax: (e: ChangeEvent<HTMLInputElement>) => void
}

export default function OngoingContracts(props: OngoingContractsProps) {
    return <div id="ongoing-contracts" className="table-responsive" style={{display: "none"}}>
        <table className="table table-striped">
            <thead>
                <tr>
                    <th># (Link)</th>
                    <th>Destination</th>
                    {props.freighter &&
                    <th>Customer</th>}
                    <th>Price</th>
                    <th>Quote</th>
                    <th>Multiplier</th>
                    <th>Volume</th>
                    <th>ISK/m³</th>
                    <th>Submitted</th>
                    {props.freighter &&
                    <>
                    <th>Freighter</th>
                    <th>Complete</th>
                    </>}
                </tr>
            </thead>
            <tbody>
                {props.contracts?.map(contract =>
                    <tr>
                        <td>
                            <a href={contract.link}>{contract.id}</a>
                        </td>
                        <td>{contract.destination}</td>
                        <td>{contract.valueShort}</td>
                        <td>{contract.quoteFormatted}</td>
                        <td>{contract.multiplier}</td>
                        <td>{contract.volumeFormatted}</td>
                        <td>{contract.valueVolumeRatioFormatted}</td>
                        <td>{contract.submittedFormatted}</td>
                        {props.freighter &&
                        <>
                        <td>{contract.freighterName}</td>
                        <td>
                            <input type="checkbox" name="complete" value={contract.value} data-contract={contract.id} onChange={props.updateTax}></input>
                        </td>
                        </>}
                    </tr>
                )}
            </tbody>
        </table>
    </div>
}