import { createTheme, rem } from "@mantine/core";

export const MantineTheme = createTheme({
  fontSmoothing: true,
  primaryColor: "cyan",
  white: "#F2F2F2",
  colors: {
    dark: [
      "#eeeeee", // 0 - Lightest gray (Text color)
      "#b8b8b8", // 1
      "#828282", // 2
      "#696969", // 3
      "#424242", // 4 - Card border, separator
      "#3b3b3b", // 5 - Button background
      "#000000", // 6 - Card background
      "#000000", // 7 - Primary background
      "#2e2e2e", // 8
      "#141414", // 9 - Darkest backgrounds
    ],
  },
  headings: {
    sizes: {
      h1: { fontSize: rem(20), fontWeight: "700" },
      h2: { fontSize: rem(30), fontWeight: "700" },
      h3: { fontSize: rem(40), fontWeight: "700" },
      h4: { fontSize: rem(50), fontWeight: "700" },
      h5: { fontSize: rem(60), fontWeight: "700" },
      h6: { fontSize: rem(60), fontWeight: "700" },
    },
  },
  defaultRadius: "md",
});
