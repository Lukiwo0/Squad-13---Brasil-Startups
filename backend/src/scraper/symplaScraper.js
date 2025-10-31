import puppeteer from 'puppeteer'

export async function getEventLinks(baseUrl) {
  const url = `${baseUrl}`
  const browser = await puppeteer.launch({
    headless: true
  })
  const pageP = await browser.newPage()

  await pageP.goto(url, { waitUntil: 'networkidle2', timeout: 60000 }) 
  const links = await pageP.$$eval('li.ais-Hits-item a.sympla-card', els =>
    els.map(el => el.href).filter(h => h.startsWith('https://'))
  )

  await browser.close()
  return links
}

export async function getEventData(url) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })
  const pageP = await browser.newPage()

  await pageP.goto(url, { waitUntil: 'networkidle2', timeout: 60000 })

  const scriptData = await pageP.$eval('#__NEXT_DATA__', el => el.textContent)
  await browser.close()

  if (!scriptData) return null
  const json = JSON.parse(scriptData)
  const event = json.props?.pageProps?.hydrationData?.eventHydration?.event
  if (!event) return null

  return {
    id: event.id,
    titulo: event.name,
    dataInicio: event.startDate,
    dataFim: event.endDate,
    descricao: event.strippedDetail,
    categoria: event.eventsCategory?.name || null,
    tipo: event.eventType,
    organizador: event.eventsHost?.name || null,
    imagem: event.images?.logoUrl || null,
    url: event.newUrl,
  }
}

// --- FUNÇÃO COM LIMITE DE EVENTOS --- (só colocar um valor ao limit, ex: limit = 5)
export async function scrapeWithLimit(baseUrl, limit = 5) {
  const links = []

  while (links.length < limit) {
    const newLinks = await getEventLinks(baseUrl)
    if (!newLinks.length) break
    links.push(...newLinks)
  }

  // Limita a quantidade
  return links.slice(0, limit)
}
