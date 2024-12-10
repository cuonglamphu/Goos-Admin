const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL as string

export const getAllProduct = async () => {
    const response = await fetch(`${NEXT_PUBLIC_API_URL}product`, {
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

export const createProduct = async (formData: any) => {
    console.log(formData);
    const response = await fetch(`${NEXT_PUBLIC_API_URL}product`, {
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

// update Product
export const updateProduct = async (formData: any) => {
    console.log(formData);
    
    const response = await fetch(`${NEXT_PUBLIC_API_URL}product/${formData._id}`, {
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

export const getProdById = async (id: string) => {
    const response = await fetch(`${NEXT_PUBLIC_API_URL}product/${id}`, {
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

export const deleteProduct = async (id: string) => {
    const response = await fetch(`${NEXT_PUBLIC_API_URL}product/${id}`, {
        method: 'DELETE',
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