
/**
 * Tests if a string is a valid email
 */
export function isEmail(email: string): boolean {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}

/**
 * Tests if a string is a valid password
 */
export function isPassword(password: string): boolean {
  return password.length > 5;
}
