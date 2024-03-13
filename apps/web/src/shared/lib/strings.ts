export const getInitials = (name: string) => {
  const words = name.split(" ");

  let initials = "";

  words.forEach((word) => {
    initials += word.charAt(0).toUpperCase();
  });

  return initials;
};
