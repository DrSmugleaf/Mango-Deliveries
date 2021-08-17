import { useEffect, useState, MouseEventHandler } from "react"
import fetchJson from "../fetch"
import Loading from "./Loading"
import Navigation from "./Navigation"

interface EveDestinations {
    name: string,
    image: string
}

export interface HeaderProps {
    destinations: EveDestinations[]
}

interface EveData {
    destinations: EveDestinations[]
}

function renderDestination(first: boolean, destination: EveDestinations, onClick: MouseEventHandler<HTMLDivElement>) {
    return <div className={first ? "col-md-2 col-md-offset-3" : "col-md-2"} onClick={onClick}>
        <div className="panel panel-default">
            <div className="panel-heading">{destination.name}</div>
            <div className="panel-body destination-image">
                <img className="img-responsive center-block" src={destination.image} width="100%"></img>
            </div>
        </div>
    </div>
}

export default function FrontPage(): JSX.Element {
    const [data, setData] = useState<EveData>()
    const [destination, setDestination] = useState<string>("")

    useEffect(() => {
        const fetchData = async () => await fetchJson("/index", setData)
        fetchData()
    }, [])

    return data ? <>
        <Navigation home={true}/>
        <div className="jumbotron">
            <div className="container">
                <h1 className="pt-2">Mango Deliveries</h1>
                <p>Welcome to Horde's finest Delivery service. We buy and ship your stuff for you. Select an Image to choose your destination. We offer a 24-hour guarantee of delivery.</p>
            </div>
        </div>
        <div className="container text-center">
            <div className="col-md-6 col-md-offset-3">
                <div id="submit-alert" className="alert" role="alert"/>
            </div>
            <form method="post" action="/submit">
                <div className="row">
                    {data.destinations.map((value: EveDestinations, index: number) => {
                        if (index % 3 === 0) {
                            return renderDestination(true, value, _ => setDestination(value.name))
                        }

                        return renderDestination(false, value, _ => setDestination(value.name))
                    })}
                </div>
                <div className="row">
                    <div className="col-md-6 col-md-offset-3">
                        <div className="form-group">
                            <div className="panel panel-default">
                                <div className="panel-heading">Contract</div>
                                <div className="panel-body">
                                    <div className="form-group">
                                        <div className="row">
                                            <label className="col-md-3" htmlFor="link">Appraisal link</label>
                                            <div className="col-md-6">
                                                <input name="link" type="text" className="form-control" id="link" placeholder="http://evepraisal.com/e/16231499" autoComplete="off" data-toggle="tooltip" title=""></input>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="input-group">
                                                    <label className="sr-only" htmlFor="multiplier">Multiplier</label>
                                                    <input name="multiplier" type="text" className="form-control" id="multiplier" placeholder="1" autoComplete="off"></input>
                                                    <div className="input-group-addon">x</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="row">
                                            <label className="col-md-3" htmlFor="destination">Destination</label>
                                            <div className="col-md-9">
                                                <input name="destination" className="form-control" type="text" id="destination" autoComplete="off" readOnly={true} value={destination}></input>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="row">
                                            <label className="col-md-3" htmlFor="jita-sell">Jita Sell</label>
                                            <div className="col-md-9">
                                                <div className="input-group">
                                                    <input className="form-control" type="text" id="jita-sell" autoComplete="off" readOnly={true}></input>
                                                    <div className="input-group-addon">ISK</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="row">
                                            <label className="col-md-3" htmlFor="quote">Quote</label>
                                            <div className="col-md-9">
                                                <div className="input-group">
                                                    <input className="form-control" type="text" id="quote" autoComplete="off" readOnly={true}></input>
                                                    <div className="input-group-addon">ISk</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <button type="submit" className="btn btn-primary">Create Contract</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </> :
    <Loading />
}
