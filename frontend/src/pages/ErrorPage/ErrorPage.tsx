import { useNavigate } from "react-router-dom"
import { useEffect } from "react"

export default function ErrorPage() {
    const navigate = useNavigate()

    useEffect(() => { navigate('/main') }, [])

    return (
        <h1>404 Not Found</h1>
    )
}