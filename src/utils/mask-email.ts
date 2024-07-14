export const maskEmail = (email: string) => {
  const [user, domainPart] = email.split("@");

  if (!user || !domainPart) {
    throw new Error("Invalid email format");
  }

  const maskedUser = user.slice(0, 3) + "*".repeat(user.length - 3);

  const maskedEmail = maskedUser + "@" + domainPart;

  return maskedEmail;
};
