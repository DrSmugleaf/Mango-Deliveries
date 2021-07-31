import { useEffect } from "react"
import Loading from "./Loading"

export default function Callback() {
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`/callback/${window.location.search}`, {
                method: "POST",
            })

            window.location.assign(response.url)
        }

        fetchData()
    })

    return <Loading />
}