import Navigation from "./Navigation"

export default function Forbidden() {
    return <>
    <Navigation />
    <div className="container">
        <div className="row">
            <div className="col-md-12">
                <div className="error-template">
                    <h1>Forbidden</h1>
                    <h2>Your alliance/corporation isn't allowed to submit contracts, or you have been banned</h2>
                    <div className="error-details">If you believe this to be a mistake, please contact a director from Mango Deliveries</div>
                    <div className="error-actions">
                        <a className="btn btn-primary btn-lg" href="/">
                            <span className="glyphicon glyphicon-home"></span> Go back
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </>
}