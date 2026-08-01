import * as Yup from "yup";

export const signUpSchema = Yup.object({
  name: Yup.string().required("Name required"),
  email: Yup.string().email("Invalid email").required("Email required"),
  password: Yup.string()
    .min(6, "Password must be aleast 6 characters")
    .required("Password required"),
  profileImage: Yup.mixed().required("Profile Image required"),
});
