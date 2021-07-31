import { AllowedCorporationsAttributes } from "../../../../web/models/eve/corporation"

export interface CorporationPanelProps {
    allowedCorporations: AllowedCorporationsAttributes[] | undefined
}

export default function CorporationPanel(props: CorporationPanelProps) {
    return <div id="corporation-panel" style={{display: "none"}}>
        <form method="post" action="/director/submit">
            <div className="panel panel-default">
                <div className="panel-heading text-center">Corporation Panel</div>
                <div className="panel-body">
                    <div className="form-group">
                        <div className="row">
                            <label className="col-md-3" htmlFor="corporation">Corporation Name</label>
                            <div className="col-md-6">
                                <input name="corporation" type="text" className="form-control" id="corporation" placeholder="Corporation" autoComplete="off"></input>
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="row text-center">
                            <button className="btn btn-success" type="submit" name="allow" style={{marginRight: "5px"}}>Allow Corporation</button>
                            <button className="btn btn-danger" type="submit" name="disallow">Disallow Corporation</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
        <div className="table-responsive">
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Corporation Name</th>
                    </tr>
                </thead>
                <tbody>
                    {props.allowedCorporations?.map(corporation =>
                        <tr>
                            <td>{corporation.name}</td>
                        </tr>)}
                </tbody>
            </table>
        </div>
    </div>
}