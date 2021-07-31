import { AllowedAlliancesAttributes } from "../../../../web/models/eve/alliance";

export interface AlliancePanelProps {
    allowedAlliances: AllowedAlliancesAttributes[] | undefined
}

export default function AlliancePanel(props: AlliancePanelProps) {
    return <div id="alliance-panel" style={{display: "none"}}>
        <form method="post" action="/director/submit">
            <div className="panel panel-default">
                <div className="panel-heading text-center">Alliance Panel</div>
                <div className="panel-body">
                    <div className="form-group">
                        <div className="row">
                            <label className="col-md-3" htmlFor="alliance">Alliance Name</label>
                            <div className="col-md-6">
                                <input name="alliance" type="text" className="form-control" id="alliance" placeholder="Alliance" autoComplete="off"></input>
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="row text-center">
                            <button className="btn btn-success" type="submit" name="allow" style={{marginRight: "5px"}}>Allow Alliance</button>
                            <button className="btn btn-danger" type="submit" name="disallow">Disallow Alliance</button>
                        </div>
                    </div>
                </div>
            </div>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Alliance Name</th>
                    </tr>
                </thead>
                <tbody>
                    {props.allowedAlliances?.map(alliance =>
                    <tr>
                        <td>
                            {alliance.name}
                        </td>
                    </tr>)}
                </tbody>
            </table>
        </form>
    </div>
}