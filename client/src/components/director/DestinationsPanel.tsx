export default function DestinationsPanel() {
    return <div id="destinations-panel" style={{display: "none"}}>
        <form method="post" action="/director/submit">
            <div className="panel panel-default">
                <div className="panel-heading text-center">Destinations Panel</div>
                <div className="panel-body">
                    <div className="form-group">
                        <div className="row">
                            <label className="col-md-3" htmlFor="name">Destination Name</label>
                            <div className="col-md-6">
                                <input name="name" type="text" className="form-control" id="destination-name" placeholder="Jita" autoComplete="off"></input>
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="row">
                            <label className="col-md-3" htmlFor="image">Destination Image</label>
                            <div className="col-md-6">
                                <input name="image" type="text" className="form-control" id="destination-image" placeholder="https://i.imgur.com/IE6tWjE.jpg" autoComplete="off"></input>
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="row text-center">
                            <button className="btn btn-success" type="submit" name="add" style={{marginRight: "5px"}} value="destination">Add Destination</button>
                            <button className="btn btn-danger" type="submit" name="remove">Remove Destination</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
}