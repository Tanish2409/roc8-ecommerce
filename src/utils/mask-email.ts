import toast from "react-hot-toast";

export const maskEmail = (email: string) => {
  const [user, domainPart] = email.split("@");

  if (!user || !domainPart) {
    toast.error("Invalid email format");
    return "";
  }

  const maskedUser = user.slice(0, 3) + "*".repeat(user.length - 3);

  const maskedEmail = maskedUser + "@" + domainPart;

  return maskedEmail;
};
