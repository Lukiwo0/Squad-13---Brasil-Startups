import dotenv from 'dotenv'
dotenv.config()

import cron from 'node-cron'
import { connectDB } from './db/connect.js'
import { saveEvent } from './db/saveEvent.js'
import { getEventData, scrapeWithLimit } from './scraper/symplaScraper.js'


async function scrapeSympla() {
  const db = await connectDB()
  let total = 0

  console.log('🚀 Iniciando scraping do Sympla...')

  const links = await scrapeWithLimit(process.env.BASE_URL)
  console.log(links)

  for (const link of links) {
    const data = await getEventData(link)
    if (data) {
      const result = await saveEvent(db, data)

      if (result === 'salvo-primeira-vez') {
        console.log(`🎉 Salvo pela primeira vez: ${data.titulo}`)
      } else if (result === 'atualizado') {
        console.log(`🔄 Evento atualizado: ${data.titulo}`)
      } else if (result === 'ja-salvo-mas-sem-atualizacao') {
        console.log(`ℹ️ Já salvo, sem atualização: ${data.titulo}`)
      }

      total++
    }
  }

  console.log(`✅ Scraping concluído. Total processado: ${total} eventos.`)
}

// Executa uma vez ao iniciar (útil pra demo/teste)
scrapeSympla()

// Agenda pra rodar todo dia às 04:00 da manhã
cron.schedule('0 4 * * *', () => {
  console.log('🕓 Rodando scraping diário...')
  scrapeSympla()
})
