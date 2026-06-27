export function validateOrderItems(items: { quantity: number; price: number }[]) {
  if (!items || items.length === 0) return 'Il carrello è vuoto'

  for (const item of items) {
    if (item.quantity < 1 || item.quantity > 99) return 'Quantità non valida'
    if (item.price < 0) return 'Prezzo non valido'
  }

  return null
}

export function sanitizeNotes(notes: string): string {
  return notes.trim().slice(0, 300)
}