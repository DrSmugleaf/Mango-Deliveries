import { ChangeEvent } from "react"
import { EveContractsAttributes } from "../../../../web/models/eve/contract.js"

export interface FinalizedContractsProps {
    freighter: boolean | undefined,
    director: boolean | undefined,
    contracts: EveContractsAttributes[] | undefined,
    updateTax: (e: ChangeEvent<HTMLInputElement>) => void
}

export default function FinalizedContracts(props: FinalizedContractsProps) {
    return <div id="finalized-contracts" className="table-responsive" style={{display: "none"}}>
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
                    <th>Taxed</th>
                    </>}
                    {props.director &&
                    <th>Tax</th>}
                </tr>
            </thead>
            <tbody>
                {props.contracts?.map(contract =>
                    <tr className={contract.status}>
                        <td>
                            <a href={contract.link}>{contract.id}</a>
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
                                <td>{contract.freighterName}</td>
                                <td>{contract.taxed ? "Yes" : "No"}</td>
                                <td>
                                    <input type="checkbox" name="tax" value={contract.value} data-contract={contract.id} onChange={props.updateTax} disabled={contract.taxed}></input>
                                </td>
                            </>}
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
}