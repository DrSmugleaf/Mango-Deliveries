import Navigation from "./Navigation";

export default function NotFound() {
    return <>
    <Navigation />
    <div className="container">
        <div className="row">
            <div className="col-md-12">
                <div className="error-template">
                    <h1>Oops!</h1>
                    <h2>404 Not Found</h2>
                    <div className="error-details">Sorry, an error has occurred</div>
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