const login = async (email: string, password: string) => {

  const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL as string
  const response = await fetch(
    `${NEXT_PUBLIC_API_URL}user/login`,
    {
      
      method: "POST",
      headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  console.log(response);
  const data = await response.json();
  return data;
};

export default login;