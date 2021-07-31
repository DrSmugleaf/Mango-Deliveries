import { useEffect } from "react"
import Loading from "./Loading"

export default function Login() {
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch("/login")
            window.location.assign(response.url)
        }

        fetchData()
    })

    return <Loading />
}