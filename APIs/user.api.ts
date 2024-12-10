const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL as string

export const getAllUser = async () => {
    const response = await fetch(`${NEXT_PUBLIC_API_URL}/user`, {
        method: 'GET',
        headers: {
            authorization: 'Bearer '
        },
        cache: 'no-store'
    })
    const data = await response.json();
    if (!response.ok) {
        console.error(data.error)
    }
    return data
}