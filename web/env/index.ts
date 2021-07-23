export function env(variable: string | undefined, or?: string): string {
  if (!variable) {
    if (or) {
      return or
    }

    throw new Error("No value set for env var")
  }

  return variable
}