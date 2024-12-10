const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL as string

export const getAllCategory = async () => {
    const response = await fetch(`${NEXT_PUBLIC_API_URL}category`, {
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

export const createCategory = async (formData: any) => {
    console.log(formData);
    const response = await fetch(`${NEXT_PUBLIC_API_URL}category`, {
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

export const updateCategory = async (formData: any) => {
    console.log(formData);
    const response = await fetch(`${NEXT_PUBLIC_API_URL}category/${formData._id}`, {
        method: "PUT",
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


export const getCateById = async (id: string) => {
    const response = await fetch(`${NEXT_PUBLIC_API_URL}category/${id}`, {
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

export const deleteCategory = async (id: string) => {
    const response = await fetch(`${NEXT_PUBLIC_API_URL}category/${id}`, {
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