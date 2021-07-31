import { InvTypesAttributes } from "../../../../web/models/eve/invtypes";

export interface ItemTypePanelProps {
    bannedItemTypes: InvTypesAttributes[] | undefined
}

export default function ItemTypePanel(props: ItemTypePanelProps) {
    return <div id="item-type-panel" style={{display: "none"}}>
        <form method="post" action="/director/submit">
            <div className="panel panel-default">
                <div className="panel-heading text-center">Item Type Panel</div>
                <div className="panel-body">
                    <div className="form-group">
                        <div className="row">
                            <label className="col-md-3" htmlFor="item">Item Type</label>
                            <div className="col-md-6">
                                <input name="item" type="text" className="form-control" id="item" placeholder="Cargo Container" autoComplete="off"></input>
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="row text-center">
                            <button className="btn btn-danger" type="submit" name="ban" style={{marginRight: "5px"}}>Ban Item Type</button>
                            <button className="btn btn-success" type="submit" name="allow">Allow Item Type</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
        <div className="table-responsive">
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Type ID</th>
                        <th>Type Name</th>
                    </tr>
                </thead>
                <tbody>
                    {props.bannedItemTypes?.map(type =>
                        <tr>
                            <td>{type.itemId}</td>
                            <td>{type.itemName}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
}