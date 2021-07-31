import { EveBannedCharacterAttributes } from "../../../../web/models/eve/character"

export interface UserPanelProps {
    bannedUsers: EveBannedCharacterAttributes[] | undefined
}

export default function UserPanel(props: UserPanelProps) {
    return <div id="user-panel" style={{display: "none"}}>
        <form method="post" action="/director/submit">
            <div className="panel panel-default">
                <div className="panel-heading text-center">User Panel</div>
                <div className="panel-body">
                    <div className="form-group">
                        <div className="row">
                            <label className="col-md-3" htmlFor="user">Username</label>
                            <div className="col-md-6">
                                <input name="user" type="text" className="form-control" id="user" placeholder="El'Miner" autoComplete="off"></input>
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="row text-center">
                            <button className="btn btn-danger" type="submit" name="ban" style={{marginRight: "5px"}}>Ban User</button>
                            <button className="btn btn-success" type="submit" name="allow">Unban User</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
        <div className="table-responsive">
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Character Name</th>
                    </tr>
                </thead>
                <tbody>
                    {props.bannedUsers?.map(user =>
                        <tr>
                            <td>{user.name}</td>
                        </tr>)}
                </tbody>
            </table>
        </div>
    </div>
}