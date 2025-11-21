import dotenv from 'dotenv'
dotenv.config()

import cron from 'node-cron'
import { connectDB } from './db/connect.js'
import { saveEvent } from './db/saveEvent.js'
import { getEventData, scrapeWithLimit } from './scraper/symplaScraper.js'

let isScraping = false

async function scrapeSympla() {
  // 🔒 Previne execução dupla
  if (isScraping) {
    console.log('⏸️ Scraping já está em execução. Aguardando...')
    return
  }

  isScraping = true
  const db = await connectDB()

  try {
    const limitLinks = 4000
    const limitPages = 100

    const startTime = Date.now()
    const events = await scrapeWithLimit(process.env.BASE_URL, limitLinks, limitPages)
    const scrapeDuration = Date.now() - startTime

    let novos = 0
    let atualizados = 0
    let semMudancas = 0

    console.log('🚀 Iniciando scraping do Sympla...\n')

    for (const event of events) {
      const result = await saveEvent(db, event)

      if (result === 'salvo-primeira-vez') {
        novos++
        console.log(`🎉 Salvo pela primeira vez: ${event.name}`)
      } else if (result === 'atualizado') {
        atualizados++
        console.log(`🔄 Evento atualizado: ${event.name}`)
      } else if (result === 'ja-salvo-mas-sem-atualizacao') {
        semMudancas++
        console.log(`ℹ️ Já salvo, sem atualização: ${event.name}`)
      }
    }

    console.log(`\n⏱️ Scraping concluído em ${(scrapeDuration / 1000 / 60).toFixed(2)} minutos`)
    console.log(`📊 Estatísticas:`)
    console.log(`   🆕 Novos eventos: ${novos}`)
    console.log(`   🔄 Atualizados: ${atualizados}`)
    console.log(`   ℹ️ Sem mudanças: ${semMudancas}`)
    console.log(`   📈 Total processado: ${events.length} eventos`)

  } catch (error) {
    console.error('❌ Erro durante scraping:', error)
  } finally {
    isScraping = false
  }
}

// Executa uma vez ao iniciar
scrapeSympla()

// Agenda pra rodar todo dia 
const scheduleScraper = '58 8 * * *'

cron.schedule(scheduleScraper, () => {
  const [minuto, hora] = scheduleScraper.split(' ')
  console.log(`🕓 Agendamento: Iniciando scraping às ${hora.padStart(2, '0')}:${minuto.padStart(2, '0')}...`)
  scrapeSympla()
})
