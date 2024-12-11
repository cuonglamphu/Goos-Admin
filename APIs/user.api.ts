const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL as string

export const getAllUser = async () => {
    const response = await fetch(`${NEXT_PUBLIC_API_URL}user`, {
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

export const createUser = async (formData: any) => {
    console.log(formData);
    const response = await fetch(`${NEXT_PUBLIC_API_URL}user/register`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer your_access_token_here`, // Replace with actual token if needed
        },
        body: JSON.stringify(formData),
    })
    const data = await response.json();
    if (!response.ok) {
        console.error(data.error)
    }
    return data
}

export const updateUser = async (formData: any) => {
    console.log(formData);
    
    const response = await fetch(`${NEXT_PUBLIC_API_URL}user/${formData._id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer your_access_token_here`,
        },
        body: JSON.stringify(formData),
    })
    const data = await response.json();
    if (!response.ok) {
        console.error(data.error)
    }
    return data
}

export const getUserById = async (id: string) => {
    const response = await fetch(`${NEXT_PUBLIC_API_URL}user/${id}`, {
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

export const deleteUser = async (id: string) => {
    try {
        const response = await fetch(`${NEXT_PUBLIC_API_URL}user/${id}`, {
            method: 'DELETE',
            headers: {
                authorization: 'Bearer '
            },
            cache: 'no-store'
        })
        const data = await response.json();
        console.log(data)
        if (!response.ok) {
            console.error(data.error)
        }
        return data
    } catch (error) {
        console.log(error)
        console.error(error)
    }
}
