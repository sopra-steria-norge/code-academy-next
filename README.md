# code-academy-next

Målet med workshopen er å få litt praktisk kjennskap til et metarammeverk, Next.js. Denne gangen skal vi jukse litt og benytte create-next-app scriptet for å generere utgangspunktet vårt. Fokuset her er på oppsettet og ikke detaljene, så beklager på forhånd til de som får brekninger av _enginerring-view_. Du må gjerne pynte på det selv underveis om det hjelper :)

Mange av dere har sikkert erfaring med flere av disse konseptene fra før, men bruk lenkene til å sette dere mer inn i det som måtte være nytt. Poenget er heller ikke her å bli først ferdig, men gjøre seg kjent med prinsippene underveis.

---

## Prerequisites

- [node med npm](https://nodejs.org/en)
- [git](https://git-scm.com/)

---

## Workshop

### Sette opp Next.js

Vi jukser litt og benytter oss av et script for å sette opp det grunnleggende. Svar __Yes__  på eslint, __No__ på tailwind (om du ikke har veldig lyst på Tailwind da), __Yes__ på `src/` directory, __Yes__ på App Router og __No__ på å tilpasse import aliasene så er vi i gang. 

__1:__ `npx create-next-app@latest basic-next --typescript`

**Merk:** dette lager en ny mappe `basic-next`. 

```bash
? Would you like to use ESLint? » No / Yes                                  (Yes)
? Would you like to use Tailwind CSS? » No / Yes                            (No)
? Would you like to use `src/` directory? ... No / Yes                      (Yes)
? Would you like to use App Router? (recommended) » No / Yes                (Yes)
? Would you like to customize the default import alias (@/*)? » No / Yes    (No)
```

```bash
...
Creating a new Next.js app in ...\basic-next.

Installing dependencies:
- react
- react-dom
- next

Installing devDependencies:
- typescript
- @types/node
- @types/react
- @types/react-dom
- eslint
- eslint-config-next
```

Next.js kommer med standardkonfigurasjoner som tar seg av det meste som trengs for å kjøre applikasjonen vår. Next.js-teamet har tatt mange valg for oss, og gjort det lettere å få opp en enkel applikasjon raskt. Men under panseret finner vi de samme byggeklossene som vi så på i forrige workshop, mer eller mindre pakket inn.

__Node__
Next.js bruker Node.js-moduler på serversiden, for eksempel for å håndtere server-side-rendering (SSR, ISR), http/https, etc. Next.js kommer også med en annen runtime, Edge Runtime, som blir brukt til middleware (Feks routing regler som redirects, rewrites og headere) men den støtter ikke alle Node.js api'ene og noen pakker vil ikke fungere. Du kan lese mer om Edge Runetime [her.](https://nextjs.org/docs/app/api-reference/edge)

__Webpack__
Next.js bruker foreløpig også Webpack under panseret, og det er mulig å gjøre endringer på webpack-configen om man skulle ønske eller ha behov for det. Men det er ikke anbefalt, og man kan risikere at nye versjoner av Next.js ikke er kompatible med spesielle webpack-configer. Du kan lese mer om Custom Webpack Config i Next.js [her](https://nextjs.org/docs/app/api-reference/next-config-js/webpack). Turbopack omtales som etterfølgeren til Webpack, og er laget av folkene back webpack sammen med Vercel som står bak Next.js. Foreløpig kan man benytte Turbopack til dev-server, men den er ikke klar for produksjon helt enda. Du kan lese mer om Turbopack [her](https://nextjs.org/docs/architecture/turbopack).

__SWC / Babel__
Fra versjon 12 bruker Next.js SWC til kompilering, men tilbyr full bakoverkompatibilitet for de som har tilpassede babel-konfigurasjoner. Når en app har et tilpasset babel-oppsett vil Next.js automatisk "opt-out" av SWC for kompilering, og benytte Babel på samme måte som tidligere versjoner. Den bruker da en standard med `next/babel` preset. Dette burde dekke de fleste behov, men kan også tilpasse Babel-oppsettet om man har behov for det. Dette gjøres ved å opprette en `.babelrc` fil på rotnivå i prosjektet (eller `babel.config.js`). Hvis en av disse filene finnes vil de ta over babel-konfigurasjoen, og man kan tilpasse den etter behov. Les mer om konfigurering av Babel [her](https://nextjs.org/docs/pages/building-your-application/configuring/babel).

---

## Routing

Vi kan bruke Next.js sin innebygde app-router ved å opprette en app-mappe i src-mappen.
__2:__ Lag en mappe, `about` i `app` og legg en `page.tsx`-fil i mappen:

```tsx
// src/app/about/page.tsx
const About = () => {
  return (
    <div>
      <h1>Om denne siden</h1>
      <p>Dette er litt dyptgpende info om "om"-siden ...</p>
    </div>
  );
};

export default About;
```

__3:__ For å gjøre det litt lettere kan vi legge inn en komponent for en meny/header:

```tsx
// src/app/components/header/Header.tsx
import Link from "next/link";
import { FC } from "react";
import styles from "./header.module.css";

const Header: FC = () => {
    return (
        <header className={styles.header}>
            <ul className={styles.navList}>
                <li className={styles.navItem}><Link href="/">Hjem</Link></li>
                <li className={styles.navItem}><Link href="/about">Om</Link></li>
                <li className={styles.navItem}><Link href="/about/deg">Om deg</Link></li>
                <li className={styles.navItem}><Link href="/companies">Firmaer</Link></li>
            </ul>
        </header>
    );
};

export default Header;
```

__4:__ En `layout.tsx` fil i `app`-mappen vil gjøre seg gjeldende for alle `page.tsx` filer lenger ned i hierarkiet en seg selv, så ved å oppdatere `layout.tsx` filen i `app`-mappen kan vi legge inn `Header` for alle sidene vi lager.

```tsx
// src/app/layout.tsx
...
<body className={`${geistSans.variable} ${geistMono.variable}`}>
    <Header />
    {children}
</body>
...
```

__5:__ Og om du får utslett av at det er så og si ustilet, kan du stile den selv, eller legge inn `header.module.css` filen fra dette repoet ved siden av `Header.tsx`. Generert av ChatGPT. Men fokuset i denne workshopen er ikke html og sminke.

__6:__ Routes kan også være dynamiske, ved å bruke `[]` i mappenavnene. For eksempel kan vi legge en mappe i `about` og kalle den `[name]` og legge en `page.tsx` fil i den:

```tsx
// src/app/about/[name]/page.tsx
import { FC } from "react";

interface ownProps { name: string }

const AboutName: FC<ownProps> = ({ name }) => {
    return <div>
        <h1>Om {name}</h1>
        <p>Dette er en side med masse info om {name}</p>
    </div >;
};

export default AboutName;
```

Du kan lese mer om app-router [her](https://nextjs.org/docs/app/building-your-application/routing/defining-routes) og dynamic routes [her](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes). Dette var bare for å demonstrere noe av det Next.js gjør for oss ut av boksen.

"Route handlers" (tidligere kalt API-routes) lar deg opprette egne request handlers ved å benytte `Request` og `Response` API'ene. De kan benyttes hvor som helst i `app`-mappen, på samme måte som `page.tsx` ved å opprette en `route.ts`-fil (men man kan ikke ha en page og en route fil i samme segment). Disse handler'ene vil bli deployet som serverless funksjoner når du deployer appen via Vercel.

__7:__ For å opprette en Route Handler oppretter vi en `route.ts` fil på ønsket sti i prosjketet. Man kan plassere en `route.ts` fil der man måtte ønske, men for oversiktlighetens skyld plasserer vi den i en egen `api` mappe i `app`. Da blir url'en til endpunktet i dette tilfellet `/api/companies`:

```tsx
// src/app/api/companies/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const res = await fetch(
    `https://data.brreg.no/enhetsregisteret/api/enheter?navn=${body.search}`
  );
  const data = await res.json();
  return NextResponse.json({
    enheter: data?._embedded?.enheter ? data?._embedded?.enheter : [],
  });
}
```

En route handler kan for eksempel håndtere tilkobling til en database eller en LLM, og kan bruke env-variabler for tilkoblingsstrenger eller tokens. 

I dette eksempelet vil routen ta imot en POST request, og søke etter en streng i enhetsregsiteret. Denne funksjonen vil av Vercel bli bygget og deployet som en serverless funksjon, en AWS lambda med Edge runtime. Vercel håndterer dette for oss i dette eksempelet, men det finnes andre prosjekter som skal kunne hjelpe til med denne prosessen om man ønsker å håndtere bygg og deploy av dette selv (ikke testet).

På dev-serveren vil endepunktet være tilgjengelig på http://localhost:3000/api/companies, og kan testes i feks. Postman.

Vi kan legge til en komponent som benytter det nye endepunktet. Opprett en ny mappe, `companies` og legge en `page.tsx` i den. Ved å legge inn `'use client'` i toppen av filen forteller vi Next.js at denne filen skal kjøre på klienten, og ikke rendres på serveren (SSR). Filer som rendrer på serveren vil ikke ha muligheten til å bruke blandt annet hooks, men kan gjøre sidene betraktelig raskere ved å for eksempel hente inn data på forhånd før siden sendes til klienten.

Dette er bare et raskt eksempel for å bruke endepunktet til noe:

__8:__ Opprett filen `src/app/companies/page.tsx`

```tsx
// src/app/companies/page.tsx
'use client'

import { FC, FormEvent, useEffect, useState } from "react";

interface CompanyProps {
    enhet: {
        navn: string;
        naeringskode1?: {
            kode: string,
            beskrivelse: string,
        }
    }
}

const Company: FC<CompanyProps> = ({ enhet }) => {
    const { navn, naeringskode1 } = enhet;
    return <tr>
        <td>{navn}</td>
        <td>{naeringskode1?.kode ? naeringskode1?.kode : '-'}</td>
        <td>{naeringskode1?.beskrivelse ? naeringskode1?.beskrivelse : '-'}</td>
    </tr>
}

const Companies = () => {
    const [enheter, setEnheter] = useState<[]>([]);

    const handleSearch = async (search: string) => {
        const enheter = await fetch('/api/companies',
            { method: "POST", body: JSON.stringify({ search: search }) }
        )
            .then(res => res.json())
            .then(data => data.enheter)
            .catch(e => console.error(e));
        setEnheter(enheter ? enheter : [])
    }

    useEffect(() => { handleSearch('Sopra Steria') }, [])

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const searchString = formData.get('search');
        if (searchString && typeof searchString === 'string') handleSearch(searchString);
    }

    return (
        <div>
            <h1>Firmaer</h1>
            <h2>Søk</h2>
            <form onSubmit={onSubmit}>
                <label htmlFor="search">Søk etter firma: </label>
                <input type="text" name="search" />
                <button type="submit">Søk</button>
            </form>
            <table>
                <thead>
                    <tr>
                        <th>Navn</th>
                        <th>Næringskode</th>
                        <th>Beskrivelse</th>
                    </tr>
                </thead>
                <tbody>
                    {enheter.map(enhet => {
                        const { organisasjonsnummer } = enhet;
                        return <Company key={organisasjonsnummer} enhet={enhet} />
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default Companies;
```

Teamet bak Next.js har også laget et bibliotek for henting av data på klienten, SWR, som medfører en rekke fordeler som cache, revalidering, refetching, m.m. Les mer om SWR [her](https://swr.vercel.app/). Har du mer tid til overs kan du gjerne skrive om funksjonen over til å bruke SWR for å hente data isteden.

---

## Deploy

__9:__ Vi antar at de fleste av dere er kjent med Git og Github, så opprett et repo for prosjektet med Githubkontoen din og push koden dit.

Det er flere måter vi kan deploye en Next.js applikasjon, men for enkelthetens skyld vil vi i denne workshopen deploye den med Vercel. Vercel har en hobby-tier som er ypperlig for vår bruk. Om du ikke har gjort det på forhånd kan du gå til [vercel.com/new](https://vercel.com/new) og velge "Continue with Github". Her velger du repoet du pushet koden til. Det kan hende du må gi Vercel tilgang til riktige repoer for at det skal dukke opp i listen.

__10:__ Opprett en hobby-konto hos Vercel, om du ikke har en fra før.

__11:__ Fortsett med Github, og gi Vercel tilgang til repoet du pushet til i steg 9.

Når repoet du opprettet er listet opp, trykk på `Import`for å begynne oppsettet.
Om du ikke har gjort noen spesielle endringer i oppsettet for appen burde standardoppsettet for en Next app fungere, og du kan trykke `Deploy` for å starte prosessen. Vercel vil da pulle repoet ditt, bygge appen, og deploye den til sin serverløse arkitektur. Med gratulasjoner og konfetti burde den fullføre uten problemer, og du kan trykke `Continue to Dashboard` og observere at appen din har fått tildelt et domene.

__12:__ Importer repoet du opprettet og deploy prosjketet ditt. 

Under `Settings` øverst kan du endre en del innstillinger, bland annet legge til environment variabler om du skulle ha behov for å koble til en database eller liknende. Om du skal sette opp auth for den deployede appen lenger ned, er det her du må legge inn env-variablene som trengs.

### Alternativer

Selv om Vercel er utviklerene bak Next.js, og har gjort prosessen veldig strømlinjeformet og tilpasset deres økosystem, er man ikke bundet til å deploye applikasjonene sine med Vercel.

__Node.js-server__ - Next kan deployes til en hvilken som helst leverandør som tilbyr Node.js med de innebygde `next build` og `next start` scriptene.

__Statisk HTML__ - Next.js kan også eksporteres som statisk HTML/CSS/JS og hostes fra en hvilken som helst web server som feks. Nginx eller Apache. Men man vil da ikke kunne benytte funksjonene som krever en server.

__Docker container__ - Next kan bygges og deployes som en docker-container. Men uten mer tilpassning får man ikke nytte av den ekstra funksjonaliteten rundt serverless / lambda.

### Docker

Om du har Docker installert på maskinen kan du bygge og kjøre prosjketet som en Docker-container

__13:__ Kopier inn `Dockerfile` fra dette repoet til roten på prosjektet, et helt enkelt oppsett som kjører appen med nodejs. 

__14:__ Legg til `output: "standalone"` i `next.config.mjs`, evt. se eksempelfilen `next.config.mjs` i dette repoet:

```js
 output: "standalone",
 ```

__15:__ Om du ikke har en `public` mappe på roten av prosjektet kan det være du må opprette den mappen også.

__16:__ Da skal du kunne bygge et docker-image av prosjektet: `docker build -t basic-react-test .`

__17:__ Og kjøre imaget: `docker run -d -p 3000:3000 basic-react-test`

Når du kjører som et docker-image får du ikke automatisk gleden av serverless-funksjonene, men med konfigurasjon kan nok dette bygges og deployes til egne Lambda eller Azure functions.

---

## Autentisering

 [NextAuth.js](https://next-auth.js.org/), eller nå [Auth.js](https://authjs.dev/), er go-to pakken for autentisering i Next.js. Denne pakken kommer med ferdige `provider`e for et stort antall autentiseringstilbydere. Og kan utvides til å håndtere det selv om man skulle ha behov for det.

I denne workshopen skal vi implementere Github som en autentiserings-provider.

__18:__ Gå til [https://github.com/settings/developers](https://github.com/settings/developers) og opprett en ny OAuth App og gi applikasjonen et passende navn. 
__19:__ For lokal utvikling set `Homepage URL` til `http://localhost:3000/` 
__20:__ Og `Authorization callback URL` til `http://localhost:3000/api/auth/callback/github`. 

Om du skal sette opp auth for applikasjonen du har deployet kan du opprette en egen OAuth App for den og fylle inn tilsvarende urler du finner i Vercel. 

__21:__ Noter deg `clientID` og `client secret`.

__22:__ I applikasjonen installerer vi next-auth pakken: `npm install next-auth`

For å benytte de nøklene vi har generert på en trygg måte, kan vi legge dem i en `.env.local` fil. Vi legger også til `NEXTAUTH_SECRET` og `NEXTAUTH_URL`, disse er ikke påkrevd i dev men vil gi advarsler i loggene og er påkrevd i produksjon.

__23:__ Generer en egen `NEXTAUTH_SECRET` i en terminal med `openssl rand -base64 32` (på Mac, linux, WSL eller Cygwin)

__24:__ Opprett filen `.env.local` på roten av prosjketet

```env
# .env.local
NEXTAUTH_SECRET="<generer eller finn på en auth secret>"
NEXTAUTH_URL=http://localhost:3000/

AUTH_GITHUB_ID=<clientID fra Github>
AUTH_GITHUB_SECRET=<client secret fra Github>
```

For å benytte oss av autentiseringen må vi legge inn litt config og sette opp en route som den kan benytte. Vi kan også legge til en liten hjelpe-funksjon som lar oss hente sesjonen på server uten å måtte importere authOptions objektet hver gang. Vi legger options og hjelpefunksjon i en egen fil.

__25:__ Opprett filen `src/auth.ts`:

```tsx
// src/auth.ts
import { AuthOptions, getServerSession } from "next-auth";
import GithubProvider from "next-auth/providers/github";

const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.AUTH_GITHUB_ID || "",
      clientSecret: process.env.AUTH_GITHUB_SECRET || "",
    }),
  ],
};

const getSession = () => getServerSession(authOptions);

export { authOptions, getSession };
```

Og setter opp en route for å fange autentiseringspathene, ved å bruke `[]` som tidligere lar vi `next-auth` håndtere de ulike auth pathene.

__26:__ Opprett mappene `src/app/api/auth/[...nextauth]`.

__27:__ Opprett filen `src/app/api/auth/[...nextauth]`:

```tsx
// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
```

Du kan lese mer om `next.auth` oppsettet [her](https://next-auth.js.org/configuration/initialization#route-handlers-app).

For å få tilgang til sesjonen på serveren må vi kun gjøre et kall til `getSession()`, med `await`.

For å få tilgang til sesjonen fra klienten, må vi wrappe applikasjonen i en `<SessionProvider />`. Problemet er bare at `<SessionProvider />` er en Client Component, og må mates med `session` objektet vi får fra `getSession()`, en Server Component. Det betyr at vi ikke bare kan putte `<SessionProvider />` i `RootLayout`. Vi kan sette opp en egen `<Providers />` som en client component som tar imot sesjonen og `children`.

__28:__ Opprett filen `src/app/Providers`:

```tsx
// src/app/Providers.tsx
"use client"

import type { Session } from "next-auth"
import { SessionProvider } from "next-auth/react"

export default function Providers({ session, children }: { session: Session | null, children: React.ReactNode }) {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  )
}
```

__29:__ Oppdater `src/app/layout.tsx`, legg til importene øverst og oppdater `RootLayout` funkksjonen som nedenfor:

```tsx
// src/app/layout.tsx
...

import { getSession } from "@/auth";
import Providers from "./Providers";

...

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers session={session}>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
```

Så kan vi kalle `useSession()` i en client component, for demonstrasjonens skyld oppretter vi en ny komponent i `src/app/components/header` og kaller den `CurrentUser.tsx`. Denne må være en `'use client'` komponent

__30:__ Opprett filen `src/app/components/header/CurrentUser.tsx` som nedenfor:

```tsx
// src/app/components/header/CurrentUser.tsx
'use client'

import { useSession } from "next-auth/react";
import Link from "next/link";
import styles from "./header.module.css";

const CurrentUser = () => {
  const { data: session, status } = useSession()

  if (status === 'authenticated') {
    return (<>
      <li className={styles.navItem}><Link href="/user">{session.user?.name}</Link></li>
      <li className={styles.navItem}><Link href="/api/auth/signout">Logg ut</Link></li>
    </>
    )
  } else return <li className={styles.navItem}><Link href="/api/auth/signin">Login</Link></li>
}

export default CurrentUser;
```

__31:__ Oppdater `src/app/components/header/Header.tsx` til å bruke den nye `CurrentUser` komponenten:

```tsx
// src/app/components/header/Header.tsx
...
import CurrentUser from "./CurrentUser"

...
        <li className={styles.navItem}><Link href="/companies">Firmaer</Link></li>
        <CurrentUser />
    </ul>
...
```

__32:__ Legg til en ny `src/app/user/page.tsx`, som en client component, for å bruke sesjonen til noe:

```tsx
// src/app/user/page.tsx
'use client'

import { useSession } from "next-auth/react";

const User = () => {
  const { data: session, status } = useSession();
  return <div>
    <br />
    <br />
    <center>
      {status === "loading" && (<div>Loading</div>)}
      {status === "authenticated" && session?.user && (
        <div>Logget inn som: {session?.user?.name}</div>
      )}
      {status === "unauthenticated" && (<div>Ikke logget inn</div>)}
    </center>
  </div>
}

export default User;
```

Superbra html og css sålangt ...

__33:__ Få denne applikasjonen til så skinne med dine magiske fingre, og litt html og css ... om du vil
