import type { AppProps } from "next/app";
import { ColorModeScript, ChakraProvider } from "@chakra-ui/react";
import { theme } from "../chakra/theme";
import { FirebaseProvider } from "../context/FirebaseContext";
import { SocketProvider } from "../context/SocketContext";
import { ScreenStreamProvider } from "../context/ScreenStreamContext";
import { MediaStreamProvider } from "../context/MediaSteamContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <FirebaseProvider>
      <SocketProvider>
        <ScreenStreamProvider>
          <MediaStreamProvider>
            <ChakraProvider theme={theme}>
              <ColorModeScript
                initialColorMode={theme.config.initialColorMode}
              />
              <Component {...pageProps} />
            </ChakraProvider>
          </MediaStreamProvider>
        </ScreenStreamProvider>
      </SocketProvider>
    </FirebaseProvider>
  );
}
