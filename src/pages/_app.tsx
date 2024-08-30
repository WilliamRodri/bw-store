import Head from 'next/head'
import { Router, useRouter } from 'next/router'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import NProgress from 'nprogress'
import { CacheProvider } from '@emotion/react'
import type { EmotionCache } from '@emotion/cache'
import themeConfig from 'src/configs/themeConfig'
import UserLayout from 'src/layouts/UserLayout'
import ThemeComponent from 'src/@core/theme/ThemeComponent'
import { SettingsConsumer, SettingsProvider } from 'src/@core/context/settingsContext'
import { createEmotionCache } from 'src/@core/utils/create-emotion-cache'
import 'react-perfect-scrollbar/dist/css/styles.css'
import '../../styles/globals.css'
import { parseCookies } from 'nookies'

type ExtendedAppProps = AppProps & {
  Component: NextPage
  emotionCache: EmotionCache
}

const clientSideEmotionCache = createEmotionCache()

if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', () => {
    NProgress.start()
  })
  Router.events.on('routeChangeError', () => {
    NProgress.done()
  })
  Router.events.on('routeChangeComplete', () => {
    NProgress.done()
  })
}

const App = (props: ExtendedAppProps) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props
  const router = useRouter()
  const cookies = parseCookies();
  let clientData;

  if (cookies?.clientData) {
    try {
      clientData = JSON.parse(cookies.clientData);
    } catch (e) {
      console.error("Erro ao analisar clientData:", e);
      clientData = { empresa: "BW" };
    }
  } else {
    clientData = { empresa: "BW" };
  }

  // Verifique se a rota atual é a página de impressão
  const isPrintPage = router.pathname.startsWith('/vendas/print/')

  if (isPrintPage) {
    return <Component {...pageProps} /> // Renderiza apenas o conteúdo da página de impressão, sem layout
  }

  // Se não for a página de impressão, use o layout padrão
  const getLayout = Component.getLayout ?? (page => <UserLayout>{page}</UserLayout>)

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>{`${themeConfig.templateName} / ${clientData?.empresa}`}</title>
        <meta
          name='description'
          content={`${themeConfig.templateName} – Sistema de controle de vendas.`}
        />
        <meta name='viewport' content='initial-scale=1, width=device-width' />
      </Head>

      <SettingsProvider>
        <SettingsConsumer>
          {({ settings }) => (
            <ThemeComponent settings={settings}>{getLayout(<Component {...pageProps} />)}</ThemeComponent>
          )}
        </SettingsConsumer>
      </SettingsProvider>
    </CacheProvider>
  )
}

export default App