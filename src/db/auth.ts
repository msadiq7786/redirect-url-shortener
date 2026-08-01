import { supabase, supabaseUrl } from "./supabase";

// LOGIN
export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// SIGN UP
export async function signup({
  name,
  email,
  password,
  profileImage,
}: {
  name: string;
  email: string;
  password: string;
  profileImage: File | null;
}) {
  const fileName = `dp-${name.split(" ").join("-")}-${Math.random()}`;
  const { error: storageError } = await supabase.storage
    .from("profile_pic")
    .upload(fileName, profileImage);

  if (storageError) {
    throw new Error(storageError.message);
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        profile: `${supabaseUrl}/storage/v1/object/public/profile_pic/${fileName}`,
      },
    },
  });
  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// Logout
export async function logout() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
}

// Get User
export async function getUser() {
  const { data: session, error } = await supabase.auth.getSession();
  if (!session.session) {
    return null;
  }

  if (error) {
    throw new Error(error.message);
  }

  return session.session?.user;
}
