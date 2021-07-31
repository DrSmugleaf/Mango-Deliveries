import { SettingsAttributes } from "../../../../web/models/eve/settings"

export interface SettingsPanelProps {
    settings: SettingsAttributes | undefined
}

export default function SettingsPanel(props: SettingsPanelProps) {
    return <div id="settings-panel" style={{display: "none"}}>
        <form method="post" action="/director/submit">
            <div className="panel panel-default">
                <div className="panel-heading text-center">Settings Panel</div>
                <div className="panel-body">
                    <div className="form-group">
                        <div className="row">
                            <label className="col-md-3" htmlFor="maxVolume">Volume</label>
                            <div className="col-md-6">
                                <input name="maxVolume" type="text" className="form-control" id="max-volume" placeholder="300000" autoComplete="off"></input>
                            </div>
                            <div className="col-md-3">
                                <p>Current: {props.settings?.maxVolume}</p>
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="row text-center">
                            <button className="btn btn-success" type="submit" name="apply">Apply</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
}