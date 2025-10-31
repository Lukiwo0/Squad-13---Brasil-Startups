export async function saveEvent(db, eventData) {
  const collection = db.collection('events')

  const result = await collection.updateOne(
    { id: eventData.id },
    { $set: eventData },
    { upsert: true }
  )

  if (result.upsertedCount > 0) {
    return 'salvo-primeira-vez'           // Evento inserido pela primeira vez
  } else if (result.modifiedCount > 0) {
    return 'atualizado'                   // Evento já existia e foi atualizado
  } else {
    return 'ja-salvo-mas-sem-atualizacao' // Evento já existia e não mudou nada
  }
}
