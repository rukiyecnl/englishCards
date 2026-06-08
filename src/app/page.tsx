import WordForm from "@/components/WordForm";
import { getWords } from "@/app/actions/wordActions";
import Flashcard from "@/components/FlashCard";

// Next.js'in sayfayı statik olarak cache'lemesini engelliyoruz.
// Böylece yeni kelime eklendiğinde kartlar anında ekranda belirecek.
export const dynamic = "force-dynamic";

export default async function Home() {
  const response = await getWords();
  const words = response.success
    ? response.data.map((word) => ({
        ...word,
        type: (word as { type?: string }).type ?? "unknown",
      }))
    : [];

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 gap-12 py-12">
      <div className="text-center max-w-md">
        <h1 className="text-xl font-extrabold font-serif text-gray-900 tracking-tight sm:text-5xl bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">
          AuraCards
        </h1>
      </div>

      {/* 3D Çalışma Kartı ve Durum Paneli */}
      <Flashcard words={words || []} />
      <hr className="w-full max-w-md border-gray-200" />
    </main>
  );
}