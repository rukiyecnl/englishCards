'use client'

import { addWord } from '@/app/actions/wordActions'
import { useState, useRef } from 'react'

export default function WordForm() {
  const [status, setStatus] = useState("unlearned")
  const [activeTab, setActiveTab] = useState("word") // "word" veya "expression"
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (formData: FormData) => {
    await addWord(formData)
    formRef.current?.reset() // Ekleme işleminden sonra formu temizle
    setStatus("unlearned")
  }

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-xl border border-gray-100">
      
      {/* 📑 Kelime / Kalıp Seçim Sekmeleri */}
      <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
        <button type="button" onClick={() => setActiveTab("word")} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'word' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>🔤 Kelime (Word)</button>
        <button type="button" onClick={() => setActiveTab("expression")} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'expression' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>🗣️ Kalıp (Expression)</button>
      </div>

      <h2 className="text-lg font-extrabold text-gray-800 mb-4 text-center">
        {activeTab === 'word' ? "🆕 Yeni Kelime Ekle" : "✨ Yeni Kalıp İfade Ekle"}
      </h2>
      
      <form ref={formRef} action={handleSubmit} className="flex flex-col gap-4">
        {/* Gizli Tipi Gönderiyoruz */}
        <input type="hidden" name="type" value={activeTab} />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">
              {activeTab === 'word' ? "İngilizce Kelime" : "Kalıp Yapı (EN)"}
            </label>
            <input type="text" name="english" required placeholder={activeTab === 'word' ? "e.g., Relentless" : "e.g., Break a leg"} className="w-full px-3 py-2 border rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-blue-400 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Anlamı (TR)</label>
            <input type="text" name="turkish" required placeholder={activeTab === 'word' ? "örn: Amansız" : "örn: İyi şanslar"} className="w-full px-3 py-2 border rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-blue-400 outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1">Örnek Cümle (Opsiyonel)</label>
          <input type="text" name="sentence" placeholder="Cümle içinde kullanımını yaz..." className="w-full px-3 py-2 border rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-blue-400 outline-none" />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1">İpucu / Not (Opsiyonel)</label>
          <textarea name="notes" rows={2} placeholder="Hatırlatıcı not veya ipucu bırak..." className="w-full px-3 py-2 border rounded-lg text-sm text-gray-800 resize-none focus:ring-2 focus:ring-blue-400 outline-none" />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1">Başlangıç Durumu</label>
          <input type="hidden" name="status" value={status} />
          <div className="flex gap-2 justify-between">
            <button type="button" onClick={() => setStatus("unlearned")} className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all ${status === 'unlearned' ? 'bg-red-50 border-red-500 text-red-700 font-bold' : 'bg-white text-gray-500'}`}>🔴 Öğrenilmedi</button>
            <button type="button" onClick={() => setStatus("medium")} className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all ${status === 'medium' ? 'bg-amber-50 border-amber-500 text-amber-700 font-bold' : 'bg-white text-gray-500'}`}>🟡 Orta</button>
            <button type="button" onClick={() => setStatus("learned")} className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all ${status === 'learned' ? 'bg-green-50 border-green-500 text-green-700 font-bold' : 'bg-white text-gray-500'}`}>🟢 Öğrenildi</button>
          </div>
        </div>

        <button type="submit" className={`w-full text-white font-bold py-2 rounded-lg text-sm shadow-md transition-colors mt-2 ${activeTab === 'word' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
          {activeTab === 'word' ? "Kelime Listesine Ekle" : "Kalıp Listesine Ekle"}
        </button>
      </form>
    </div>
  )
}