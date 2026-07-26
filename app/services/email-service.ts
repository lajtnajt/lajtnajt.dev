export async function sendEmail(formData: FormData) {
  const accessKey = process.env.VITE_WEB3FORMS_ACCESS_KEY

  if (!accessKey) {
    throw new Error("The webform access key is missing")
  }

  formData.append("access_key", accessKey)

  const response = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    body: formData,
  })

  const data = await response.json()

  if (!data.success) {
    throw new Error(data.message || "Sending email failed")
  }

  return data
}
