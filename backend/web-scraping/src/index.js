import dotenv from 'dotenv'
dotenv.config()

import cron from 'node-cron'
import { connectDB } from './db/connect.js'
import { saveEvent } from './db/saveEvent.js'
import { getEventData, scrapeWithLimit } from './scraper/symplaScraper.js'


async function scrapeSympla() {
  const db = await connectDB()
  const limitLinks = 5000, limitPages = 100

  console.log('🚀 Iniciando scraping do Sympla...')

  const events = await scrapeWithLimit(process.env.BASE_URL, limitLinks, limitPages)

  for (const event of events) {
    const result = await saveEvent(db, event)

    if (result === 'salvo-primeira-vez') {
      console.log(`🎉 Salvo pela primeira vez: ${event.name}`)
    } else if (result === 'atualizado') {
      console.log(`🔄 Evento atualizado: ${event.name}`)
    } else if (result === 'ja-salvo-mas-sem-atualizacao') {
      console.log(`ℹ️ Já salvo, sem atualização: ${event.name}`)
    }

  }

  console.log(`✅ Scraping concluído. Total processado: ${events.length} eventos.`)
}

// Executa uma vez ao iniciar
scrapeSympla()

// Agenda pra rodar todo dia às 04:00 da manhã
cron.schedule('0 4 * * *', () => {
  console.log('🕓 Rodando scraping diário...')
  scrapeSympla()
})
