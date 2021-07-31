import { Dispatch } from "react";

export default async function fetchJson<T>(endpoint: string, setter: Dispatch<T>, redirect = true, onRedirect?: () => void): Promise<void> {
    const result = await fetch(endpoint)

    if (result.redirected && result.url) {
        if (redirect) {
            window.location.assign(result.url)
            return
        } else {
            onRedirect?.()
            return
        }
    }

    const json = await result.json()
    setter(json)
}