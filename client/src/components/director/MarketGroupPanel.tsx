import { InvMarketGroupsAttributes } from "../../../../web/models/eve/invmarketgroups"

export interface MarketGroupPanelProps {
    bannedMarketGroups: InvMarketGroupsAttributes[] | undefined
}

export default function MarketGroupPanel(props: MarketGroupPanelProps) {
    return <div id="market-group-panel" style={{display: "none"}}>
        <form method="post" action="/director/submit">
            <div className="panel panel-default">
                <div className="panel-heading text-center">Market Group Panel</div>
                <div className="panel-body">
                    <div className="form-group">
                        <div className="row">
                            <label className="col-md-3" htmlFor="group">Market Group</label>
                            <div className="col-md-6">
                                <input name="group" type="text" className="form-control" id="group" placeholder="Frigate" autoComplete="off"></input>
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="row text-center">
                            <button className="btn btn-danger" type="submit" name="ban" style={{marginRight: "5px"}}>Ban Market Group</button>
                            <button className="btn btn-success" type="submit" name="allow">Allow Market Group</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
        <div className="table-responsive">
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Group ID</th>
                        <th>Group Name</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {props.bannedMarketGroups?.map(group =>
                        <tr>
                            <td>{group.marketGroupId}</td>
                            <td>{group.marketGroupName}</td>
                            <td>{group.description}</td>
                        </tr>)}
                </tbody>
            </table>
        </div>
    </div>
}