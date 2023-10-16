import type { AppProps } from "next/app";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import "../styles/globals.css";
import { ConnectWallet, ThirdwebProvider } from "@thirdweb-dev/react";

const theme = extendTheme({
  fonts: {
    body: 'Inter, sans-serif',
    heading: 'Poppins, sans-serif',
  },
  colors: {
    brand: {
      500: '#007BFF',
    },
    blackAndWhite: {
      900: '#000', // Black
      50: '#FFF',   // White
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider
      clientId="cd53e0c74ffcf66da0d8098ee483c4fc"
      activeChain="mumbai"
    >
    <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </ThirdwebProvider>
  );
}

export default MyApp;
