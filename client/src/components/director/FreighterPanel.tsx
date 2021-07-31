import { EveCharacterAttributes } from "../../../../web/models/eve/character"

export interface FreighterPanelProps {
    freighters: EveCharacterAttributes[] | undefined
}

export default function FreighterPanel(props: FreighterPanelProps) {
    return <div id="freighter-panel" style={{display: "none"}}>
        <form method="post" action="/director/submit">
            <div className="panel panel-default">
                <div className="panel-heading text-center">Freighter Panel</div>
                <div className="panel-body">
                    <div className="form-group">
                        <div className="row">
                            <label className="col-md-3" htmlFor="freighter">Freighter Name</label>
                            <div className="col-md-6">
                                <input name="freighter" type="text" className="form-control" id="freighter" placeholder="El'Miner" autoComplete="off"></input>
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="row text-center">
                            <button className="btn btn-success" type="submit" name="add" style={{marginRight: "5px"}}>Add Freighter</button>
                            <button className="btn btn-danger" type="submit" name="remove">Remove Freighter</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
        <div className="table-responsive">
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Portrait</th>
                        <th>Character ID</th>
                        <th>Character Name</th>
                        <th>Corporation Name</th>
                        <th>Alliance Name</th>
                    </tr>
                </thead>
                <tbody>
                    {props.freighters?.map(freighter =>
                        <tr>
                            <td>
                                <img src={freighter.characterPortrait} style={{width: "25px", height: "25px"}}></img>
                            </td>
                            <td>{freighter.id}</td>
                            <td>{freighter.characterName}</td>
                            <td>{freighter.corporationName}</td>
                            <td>{freighter.allianceName}</td>
                        </tr>)}
                </tbody>
            </table>
        </div>
    </div>
}