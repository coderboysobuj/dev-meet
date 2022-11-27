import { extendTheme, type ThemeConfig } from "@chakra-ui/react";
import { GlobalStyleProps } from "@chakra-ui/theme-tools";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: true,
};

export const theme = extendTheme(
  { config },
  {
    colors: {
      brand: {
        100: "#3D84F7",
      },
    },
    styles: {
      global: (props: GlobalStyleProps) => ({
        body: {
          bg: props.colorMode === "dark" ? "black" : "white",
        },
      }),
    },
  }
);
