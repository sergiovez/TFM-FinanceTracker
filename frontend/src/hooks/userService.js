export async function updateProfile(data) {
  const res = await fetch("/api/auth/profile/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Error actualizando perfil");
  }

  return res.json();
}

