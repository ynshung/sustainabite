export const normalizePhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return;
  phoneNumber = phoneNumber.replace(/\s/g, "");
  if (phoneNumber.substring(0, 2) !== "+6") {
    return "+6" + phoneNumber;
  } else if (phoneNumber.charAt(0) !== "+") {
    return "+" + phoneNumber;
  } else {
    return phoneNumber;
  }
};
