'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { updateWordStatus } from '@/app/actions/wordActions'
import WordForm from './WordForm'

interface Word {
  id: string
  english: string
  turkish: string
  sentence?: string | null
  notes?: string | null
  status: string
  type: string // Eklenen tip alanı
}

interface FlashcardProps {
  words: Word[]
}

export default function Flashcard({ words = [] }: FlashcardProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [viewType, setViewType] = useState("word") // "word" veya "expression" çalışma modu
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [isListOpen, setIsListOpen] = useState(false)

  // Önce seçili tipe (Kelime/Kalıp) göre havuzu daraltıyoruz
  const typeFilteredWords = words.filter(w => w.type === viewType)

  // Sonra üst durum butonlarına (🔴🟡🟢) göre süzüyoruz
  const countByStatus = (status: string) => {
    return typeFilteredWords.filter(w => w.status?.toLowerCase() === status.toLowerCase()).length
  }

  const filteredWords = activeFilter 
    ? typeFilteredWords.filter(w => w.status?.toLowerCase() === activeFilter.toLowerCase())
    : typeFilteredWords

  const currentWord = filteredWords[currentIndex]

  const handleNext = () => {
    setIsFlipped(false)
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredWords.length)
    }, 150)
  }

  const handleStatusChange = async (newStatus: string) => {
    if (!currentWord) return
    currentWord.status = newStatus
    await updateWordStatus(currentWord.id, newStatus)
  }

  const toggleFilter = (status: string) => {
    if (activeFilter === status) {
      setActiveFilter(null)
      setIsListOpen(false)
    } else {
      setActiveFilter(status)
      setIsListOpen(true)
      setCurrentIndex(0)
    }
  }

  const handleTabChange = (type: string) => {
    setViewType(type)
    setActiveFilter(null)
    setIsListOpen(false)
    setCurrentIndex(0)
    setIsFlipped(false)
  }

  return (
    <div className="w-full max-w-4xl flex flex-col gap-6">
      
      {/* 🗺️ Çalışma Modu Seçimi (Üst Büyük Sekme) */}
      <div className="flex justify-center gap-4 max-w-sm mx-auto w-full border-b border-gray-200 pb-2">
        <button onClick={() => handleTabChange("word")} className={`flex-1 pb-2 text-sm font-extrabold border-b-2 transition-colors ${viewType === 'word' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>🔤 Kelimeler</button>
        <button onClick={() => handleTabChange("expression")} className={`flex-1 pb-2 text-sm font-extrabold border-b-2 transition-colors ${viewType === 'expression' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>🗣️ Kalıplar (Expressions)</button>
        <button onClick={() => handleTabChange("add")} className={`flex-1 pb-2 text-sm font-extrabold border-b-2 transition-colors ${viewType === 'add' ? 'border-green-600 text-green-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>📋 Kelime / Kalıp Ekle</button>
      </div>

      {/* 🔴 🟡 🟢 Üst İlerleme Daireleri Paneli */}
      <div className="flex gap-4 justify-center items-center">
        <div >
      {viewType !== 'add' && (
        <div className="flex flex-col justify-center items-center gap-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 max-w-md mx-auto w-full">
          <button onClick={() => toggleFilter("unlearned")} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${activeFilter === 'unlearned' ? 'bg-red-50 scale-105 ring-2 ring-red-400' : 'hover:bg-gray-50'}`}>
            <span className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">{countByStatus("unlearned")}</span>
            <span className="text-xs font-medium text-gray-500">Öğrenilmedi</span>
          </button>
        <button onClick={() => toggleFilter("medium")} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${activeFilter === 'medium' ? 'bg-amber-50 scale-105 ring-2 ring-amber-400' : 'hover:bg-gray-50'}`}>
          <span className="w-16 h-16 rounded-full bg-amber-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">{countByStatus("medium")}</span>
          <span className="text-xs font-medium text-gray-500">Orta Seviye</span>
        </button>
        <button onClick={() => toggleFilter("learned")} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${activeFilter === 'learned' ? 'bg-green-50 scale-105 ring-2 ring-green-400' : 'hover:bg-gray-50'}`}>
          <span className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">{countByStatus("learned")}</span>
          <span className="text-xs font-medium text-gray-500">Öğrenildi</span>
        </button>
      </div>
    )}

      </div>
      {viewType === 'add' ? (
        <WordForm />
      ) : filteredWords.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-2xl shadow-md border max-w-md mx-auto w-full text-gray-400">
          Bu kategoride henüz {viewType === 'word' ? 'kelime' : 'kalıp ifade'} bulunamadı. Formu kullanarak ilkini ekleyebilirsin!
        </div>
      ) : (
        /* Ana Kart Alanı */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          
          {/* Sol Kolon: 3D Kart */}
          <div className="flex flex-col gap-4">
            <div className="w-full h-72 perspective-1000 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
              <motion.div className="w-full h-full relative preserve-3d" animate={{ rotateY: isFlipped ? 180 : 0 }} transition={{ duration: 0.5, ease: "easeInOut" }}>
                
                {/* 🎨 DİNAMİK ÖN YÜZ - Tipe göre renk değişimi sağlandı */}
                <div className={`absolute top-0 left-0 w-full h-full bg-linear-to-br rounded-2xl shadow-xl flex flex-col items-center justify-center p-6 backface-hidden text-white ${viewType === 'word' ? 'from-indigo-600 to-blue-600' : 'from-emerald-600 to-teal-600'}`}>
                  <div className="absolute top-4 left-4 flex gap-1.5">
                    <span onClick={(e) => { e.stopPropagation(); handleStatusChange("unlearned"); }} className={`w-3 h-3 rounded-full bg-red-500 cursor-pointer hover:scale-125 transition-transform ${currentWord?.status === 'unlearned' ? 'ring-4 ring-white' : 'opacity-40'}`} />
                    <span onClick={(e) => { e.stopPropagation(); handleStatusChange("medium"); }} className={`w-3 h-3 rounded-full bg-amber-500 cursor-pointer hover:scale-125 transition-transform ${currentWord?.status === 'medium' ? 'ring-4 ring-white' : 'opacity-40'}`} />
                    <span onClick={(e) => { e.stopPropagation(); handleStatusChange("learned"); }} className={`w-3 h-3 rounded-full bg-green-500 cursor-pointer hover:scale-125 transition-transform ${currentWord?.status === 'learned' ? 'ring-4 ring-white' : 'opacity-40'}`} />
                  </div>
                  <span className="text-[10px] font-bold tracking-widest uppercase opacity-60 mb-2">
                    {viewType === 'word' ? "ENGLISH WORD" : "ENGLISH EXPRESSION"}
                  </span>
                  <h2 className="text-2xl font-extrabold text-center tracking-wide px-4 leading-snug">{currentWord?.english}</h2>
                  <p className="text-[11px] opacity-50 absolute bottom-4">Anlamını görmek için tıkla</p>
                </div>

                {/* ARKA YÜZ */}
                <div className="absolute top-0 left-0 w-full h-full bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col items-center justify-center p-6 backface-hidden text-gray-800" style={{ transform: 'rotateY(180deg)' }}>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-2">ANLAMI</span>
                  <h2 className={`text-2xl font-extrabold text-center tracking-wide px-4 ${viewType === 'word' ? 'text-indigo-600' : 'text-emerald-600'}`}>{currentWord?.turkish}</h2>
                  <p className="text-[11px] text-gray-400 absolute bottom-4">Yapıya dönmek için tıkla</p>
                </div>

              </motion.div>
            </div>

            <div className="flex justify-between items-center px-2 text-xs text-gray-400 font-medium">
              <span>Sıra: {currentIndex + 1} / {filteredWords.length}</span>
              <button onClick={handleNext} className="bg-gray-900 hover:bg-gray-800 text-white font-medium px-4 py-2 rounded-xl transition-all shadow active:scale-95 flex items-center gap-1.5">
                Sonraki ➡️
              </button>
            </div>
          </div>

          {/* Sağ Kolon: Yan Not Kartı */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 flex flex-col justify-between min-h-72">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                <span className="text-lg">{viewType === 'word' ? '📝' : '💬'}</span>
                <h3 className="text-sm font-bold text-gray-700 tracking-tight">
                  {viewType === 'word' ? "Kelime Bilgi ve Not Paneli" : "Kalıp Yapı ve Not Paneli"}
                </h3>
              </div>

              {/* Örnek Cümle */}
              <div className="flex flex-col gap-1.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">💡 Örnek Cümle</span>
                <p className="text-sm italic font-medium text-slate-700 leading-relaxed">
                  {currentWord?.sentence ? `"${currentWord.sentence}"` : "Bunun için henüz bir örnek cümle girilmemiş."}
                </p>
              </div>

              {/* İpucu / Not */}
              <div className="flex flex-col gap-1.5 bg-amber-50/60 p-3 rounded-xl border border-amber-100/60">
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">📌 İpuçları & Hatırlatıcı Notlar</span>
                <p className="text-sm text-amber-900 font-medium whitespace-pre-line">
                  {currentWord?.notes ? currentWord.notes : "Kişisel bir hatırlatıcı not bulunmuyor."}
                </p>
              </div>
            </div>

            <div className="text-[11px] text-gray-400 text-right font-medium border-t border-gray-50 pt-2 mt-4">
              Tür: <span className="capitalize font-bold">{viewType}</span> | #{currentWord?.id?.slice(-6)}
            </div>
          </div>

        </div>
      )}
    </div>
      <AnimatePresence>
        {isListOpen && filteredWords.length > 0 && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white p-4 rounded-2xl border border-gray-100 max-w-md mx-auto min-w-full max-h-140 overflow-y-auto shadow-inner flex flex-col gap-1.5">
            <div className="w-full flex justify-between items-center text-xs font-bold text-gray-400 uppercase mb-1 tracking-wider">
              <span>Mevcut Liste ({filteredWords.length})</span>
              <button onClick={() => setIsListOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            {filteredWords.sort((a, b) => a.english.localeCompare(b.english)).map((word, idx) => (
              <button key={word.id} onClick={() => { setCurrentIndex(idx); setIsListOpen(false); }} className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors flex justify-between items-center ${currentIndex === idx ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}>
                <span>{word.english}</span>
                <span className="text-xs text-gray-400">{word.turkish}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}