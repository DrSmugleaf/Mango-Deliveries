export function env(variable: string, defaultValue?: string): string {
  const value = process.env[variable]

  if (!value) {
    if (defaultValue !== undefined) {
      return defaultValue
    }

    throw new Error(`No value set for env var ${variable}`)
  }

  return value
}