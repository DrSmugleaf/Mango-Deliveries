import { useEffect, useState } from "react";
import { EveCharacterAttributes } from "../../../web/models/eve/character.js"
import fetchJson from "../fetch";
import Loading from "./Loading";

interface WithLoginProps {
    page: JSX.Element
}

export default function WithLogin(props: WithLoginProps): JSX.Element {
    const [character, setCharacter] = useState<EveCharacterAttributes>()

    useEffect(() => {
        const fetchData = async () => await fetchJson("/character", setCharacter)
        fetchData()
    }, [])

    return character ? props.page : <>
    <Loading />
    </>
}