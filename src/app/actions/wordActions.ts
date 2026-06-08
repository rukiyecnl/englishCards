"use server"
import db from "@/lib/db"
import { revalidatePath } from "next/cache"

function capitalizeWord(text: string, locale: string): string {
  if (!text) return ""
  const trimmed = text.trim()
  return trimmed.charAt(0).toLocaleUpperCase(locale) + trimmed.slice(1)
}

export async function addWord(formData: FormData) {
  const rawEnglish = formData.get("english") as string
  const rawTurkish = formData.get("turkish") as string
  const rawSentence = formData.get("sentence") as string || null
  const rawNotes = formData.get("notes") as string || null
  const status = formData.get("status") as string || "unlearned"
  const type = formData.get("type") as string || "word" // Yeni alan

  if (!rawEnglish || !rawTurkish) return

  const english = capitalizeWord(rawEnglish, 'en-US')
  const turkish = capitalizeWord(rawTurkish, 'tr-TR')
  const sentence = rawSentence ? capitalizeWord(rawSentence, 'tr-TR') : null
  const notes = rawNotes ? capitalizeWord(rawNotes, 'tr-TR') : null

  await db.word.create({
    data: { english, turkish, sentence, notes, status, type },
  })

  revalidatePath("/")
}

export async function updateWordStatus(id: string, status: string) {
  try {
    await db.word.update({
      where: { id },
      data: { status },
    })
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    return { success: false, error }
  }
}

export async function getWords() {
  try {
    const words = await db.word.findMany({
      orderBy: { english: 'desc' },
    })
    return { success: true, data: words }
  } catch (error) {
    return { success: false, data: [] }
  }
}