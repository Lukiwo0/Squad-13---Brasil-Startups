import puppeteer from 'puppeteer'

export async function getEventLinks(baseUrl, limitLinks = 100, limitPages = 20) {
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()

  await page.goto(baseUrl, { waitUntil: 'networkidle2', timeout: 60000 })

  const links = []
  let currentPage = 1

  while (links.length < limitLinks && currentPage <= limitPages) {
    // Espera até que os links apareçam na página atual
    try {
      await page.waitForSelector('li.ais-Hits-item a.sympla-card', { timeout: 60000 })
    } catch {
      console.warn(`⚠️ Timeout esperando links na página ${currentPage}`)
      break
    }

    // Coleta todos os links visíveis da página
    const newLinks = await page.$$eval('li.ais-Hits-item a.sympla-card', els =>
      els.map(el => el.href).filter(h => h.startsWith('https://'))
    )

    newLinks.forEach(link => {
      if (!links.includes(link)) links.push(link)
    })

    if (links.length >= limitLinks) break

    // Clica no botão "Próximo" se existir
    const hasNext = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'))
      const nextBtn = btns.find(b => b.textContent.includes('Próximo'))
      if (nextBtn && !nextBtn.disabled) {
        nextBtn.click()
        return true
      }
      return false
    })

    if (!hasNext) break

    // Espera o carregamento da nova página (JS do site renderizando)
    await new Promise(resolve => setTimeout(resolve, 2500))

    currentPage++
  }

  await browser.close()
  return links.slice(0, limitLinks)
}



export async function getEventData(url) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })
  const pageP = await browser.newPage()

  await pageP.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 })
  await pageP.waitForSelector('#__NEXT_DATA__', { timeout: 60000 })

  const scriptData = await pageP.$eval('#__NEXT_DATA__', el => el.textContent)
  await browser.close()

  if (!scriptData) return null

  const json = JSON.parse(scriptData)
  const event = json.props?.pageProps?.hydrationData?.eventHydration?.event
  if (!event) return null

  return {
    id: event.id,
    name: event.name,
    newUrl: event.newUrl,
    startDate: event.startDate,
    endDate: event.endDate,
    eventsCategory: event.eventsCategory?.name || null,
    eventsHost: event.eventsHost?.name || null,
    paymentEventType: event.paymentEventType || null,
    cancelled: event.cancelled ?? false,
    strippedDetail: event.strippedDetail,
    eventsAddress: event.eventsAddress
      ? {
        city: event.eventsAddress.city || null,
        state: event.eventsAddress.state || null,
        country: event.eventsAddress.country || null,
      }
      : null,
  }
}



export async function scrapeWithLimit(baseUrl, limitLinks, limitPages) {
  const links = await getEventLinks(baseUrl, limitLinks, limitPages)
  const events = []

  console.log('\n')
  console.log('⚠️ LIMITE DE LINK(S) que o scraper irá coletar:', limitLinks)
  console.log('⚠️ LIMITE DE PÁGINA(S) que o scraper irá coletar:', limitPages)
  console.log('\n')

  console.log('🔗 Links coletados:', links)
  console.log('\n')

  for (const [index, link] of links.entries()) {
    try {
      console.log(`🕵️‍♂️ Coletando evento ${index + 1}/${links.length}...`)
      const data = await getEventData(link)
      if (data) events.push(data)
    } catch (err) {
      console.error(`⚠️ Erro ao coletar do evento evento ${index + 1}/${links.length}, Link: ${link}:`, err.message)
    }
  }

  return events
}
