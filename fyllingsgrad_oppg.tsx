/*

NVE har et API for å hente ut magasinstatistikk, nedenfor har du en enkel react komponent som bruker dataene fra api'et

Hent data fra apiet, og filtrer det ned til å returnere kun data for den inneværende uken. Det er et stort datasett, så litt av poenget er å gjøre dette som en server-component og hente data på server før de sendes til klienten. 

Tips:
- som server-component kan hele komponenten v're en sync funksjon
- Kommer dataene som en ReadableStream? Må de evt. dekodes før de kan behandles?
- https://nextjs.org/docs/app/building-your-application/data-fetching/fetching

URL: https://biapi.nve.no/magasinstatistikk/api/Magasinstatistikk/HentOffentligData
*/

type FyllingsgradStat = {
    dato_Id: string,
    omrType: string,
    omrnr: number,
    iso_aar: number,
    iso_uke: number,
    fyllingsgrad: number,
    kapasitet_TWh: number,
    fylling_TWh: number,
    neste_Publiseringsdato: string,
    fyllingsgrad_forrige_uke: number,
    endring_fyllingsgrad: number
}

const Hydro = () => {
    const stats: FyllingsgradStat[] = [];
    return (
        <div>
            <h1>Magasinstatistikk</h1>
            <table>
                <thead>
                    <tr>
                        <th>År</th>
                        <th>Uke</th>
                        <th>Område</th>
                        <th>Fyllingsgrad</th>
                        <th>Fylling</th>
                    </tr>
                </thead>
                <tbody>
                    {stats.map((stat: FyllingsgradStat) => {
                        const { omrType, omrnr, iso_aar, iso_uke, fyllingsgrad, fylling_TWh, kapasitet_TWh } = stat;
                        return <tr key={`${omrType}_${omrnr}_${iso_aar}_${iso_uke}`}>
                            <td className="">
                                {iso_aar}
                            </td>
                            <td>
                                {iso_uke}
                            </td>
                            <td>
                                {omrType}-{omrnr}
                            </td>
                            <td>
                                {fyllingsgrad} %
                            </td>
                            <td>
                                {fylling_TWh} / {kapasitet_TWh} Twh
                            </td>
                        </tr>
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default Hydro;
