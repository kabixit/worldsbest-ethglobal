import type { AppProps } from "next/app";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import "../styles/globals.css";
import {
  ThirdwebProvider,
  ConnectWallet,
  metamaskWallet,
  coinbaseWallet,
  walletConnect,
  safeWallet,
  trustWallet,
  zerionWallet,
  bloctoWallet,
  magicLink,
  frameWallet,
  rainbowWallet,
  phantomWallet,
} from "@thirdweb-dev/react";

const activeChain = "mumbai";

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
      activeChain={activeChain}
      supportedWallets={[
        metamaskWallet({ recommended: true }),
        coinbaseWallet(),
        walletConnect(),
        safeWallet({
          personalWallets: [
            metamaskWallet({ recommended: true }),
            coinbaseWallet(),
            walletConnect(),
            trustWallet(),
            zerionWallet(),
            bloctoWallet(),
            magicLink({
              apiKey: "YOUR_MAGIC_API_KEY",
              oauthOptions: {
                providers: [
                  "google",
                  "facebook",
                  "twitter",
                  "apple",
                ],
              },
            }),
            frameWallet(),
            rainbowWallet(),
            phantomWallet(),
          ],
        }),
        trustWallet(),
        zerionWallet(),
        bloctoWallet(),
        magicLink({
          apiKey: "pk_live_FA4F6865B9F35BAB",
          oauthOptions: {
            providers: [
              "google",
              "facebook",
              "twitter",
              "apple",
            ],
          },
        }),
        frameWallet(),
        rainbowWallet(),
        phantomWallet(),
      ]}
    >
    <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </ThirdwebProvider>
  );
}

export default MyApp;
