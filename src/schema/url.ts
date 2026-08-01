import * as Yup from "yup";

export const urlSchema = Yup.object({
  title: Yup.string().required("Title required"),
  originalUrl: Yup.string()
    .url("Must be valid url")
    .required("Longurl required"),
  customUrl: Yup.string().min(6, "Custom Alias must be atleast 6 characters"),
});
