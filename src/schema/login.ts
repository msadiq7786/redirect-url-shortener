import * as Yup from "yup";

// Validation schema
export const loginSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email required"),
  password: Yup.string()
    .min(6, "Password must be aleast 6 characters")
    .required("Password required"),
});
