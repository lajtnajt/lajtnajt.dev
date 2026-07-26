export async function sendEmail(formData: FormData) {
  const accessKey = "29c37438-8c62-44bc-a0d5-c92faa849f2f"

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
