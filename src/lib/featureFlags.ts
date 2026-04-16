function readBooleanEnv(value: string | undefined): boolean {
  return value?.toLowerCase() === "true";
}

export function shouldUseDummyCases(): boolean {
  return readBooleanEnv(process.env.NEXT_PUBLIC_DUMMY_CASES);
}

export function shouldUseDummyResources(): boolean {
  return readBooleanEnv(process.env.NEXT_PUBLIC_DUMMY_RESOURCES);
}
