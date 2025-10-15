// utils/getBase64Logo.ts
export async function getBase64Logo(): Promise<string> {
  const response = await fetch("/logo.png") // Must be inside /public folder
  const blob = await response.blob()

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}
