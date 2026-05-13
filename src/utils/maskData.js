// src/utils/maskData.js

export const maskEmail = (email) => {
  if (!email || !email.includes("@")) return email || "";
  
  const [localPart, domain] = email.split("@");
  
  // If the email name is very short (like ab@gmail.com)
  if (localPart.length <= 2) {
    return `${localPart[0]}***@${domain}`;
  }
  
  // Keep the first and last letter of the name, mask the middle
  const firstChar = localPart[0];
  const lastChar = localPart[localPart.length - 1];
  const maskedLocal = firstChar + '*'.repeat(localPart.length - 2) + lastChar;
  
  return `${maskedLocal}@${domain}`;
};

export const maskPhone = (phone) => {
  if (!phone || phone.length < 4) return phone || "";
  // Keep the last 4 digits visible, mask the rest
  const last4 = phone.slice(-4);
  return '*'.repeat(phone.length - 4) + last4;
};
