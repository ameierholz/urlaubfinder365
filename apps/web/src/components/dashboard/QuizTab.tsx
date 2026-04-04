"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import type { AppUser } from "@/context/AuthContext";
import { createBrowserClient } from "@supabase/ssr";
import { Brain, Trophy, CheckCircle, XCircle, Clock, Star, RotateCcw } from "lucide-react";

interface Props { user: AppUser }

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number; // index
  category: "land" | "flagge" | "hauptstadt" | "kultur";
  emoji: string;
}

// Static question pool — rotated daily via modulo on day-of-year
const QUESTION_POOL: Question[] = [
  { id: 1, question: "Was ist die Hauptstadt von Thailand?", options: ["Chiang Mai", "Bangkok", "Pattaya", "Phuket"], correct: 1, category: "hauptstadt", emoji: "🏛️" },
  { id: 2, question: "Welches Land hat die meisten UNESCO-Welterbestätten?", options: ["China", "Frankreich", "Italien", "Spanien"], correct: 2, category: "kultur", emoji: "🏛️" },
  { id: 3, question: "In welchem Land liegt das Machu Picchu?", options: ["Chile", "Bolivien", "Peru", "Ecuador"], correct: 2, category: "land", emoji: "🌎" },
  { id: 4, question: "Wie viele Inseln hat Griechenland?", options: ["Etwa 1.200", "Etwa 6.000", "Etwa 3.500", "Etwa 500"], correct: 1, category: "land", emoji: "🏝️" },
  { id: 5, question: "Welches Land hat die längste Küstenlinie der Welt?", options: ["Russland", "USA", "Australien", "Kanada"], correct: 3, category: "land", emoji: "🌊" },
  { id: 6, question: "In welcher Stadt befindet sich der Eiffelturm?", options: ["Lyon", "Nizza", "Paris", "Bordeaux"], correct: 2, category: "hauptstadt", emoji: "🗼" },
  { id: 7, question: "Was bedeutet 'Siesta' auf Spanisch?", options: ["Abendessen", "Mittagsschlaf", "Fiesta", "Spaziergang"], correct: 1, category: "kultur", emoji: "😴" },
  { id: 8, question: "Welches ist das größte Land der Welt?", options: ["China", "Kanada", "USA", "Russland"], correct: 3, category: "land", emoji: "🗺️" },
  { id: 9, question: "In welchem Land liegt Kappadokien?", options: ["Griechenland", "Armenien", "Türkei", "Syrien"], correct: 2, category: "land", emoji: "🎈" },
  { id: 10, question: "Was ist die Hauptstadt von Australien?", options: ["Sydney", "Melbourne", "Canberra", "Brisbane"], correct: 2, category: "hauptstadt", emoji: "🦘" },
  { id: 11, question: "Welches Meer liegt zwischen Europa und Afrika?", options: ["Schwarzes Meer", "Nordsee", "Mittelmeer", "Kaspisches Meer"], correct: 2, category: "land", emoji: "🌊" },
  { id: 12, question: "In welchem Land steht das Kolosseum?", options: ["Griechenland", "Spanien", "Italien", "Türkei"], correct: 2, category: "kultur", emoji: "🏟️" },
  { id: 13, question: "Welche Währung wird in Japan verwendet?", options: ["Yuan", "Won", "Yen", "Ringgit"], correct: 2, category: "kultur", emoji: "💴" },
  { id: 14, question: "Wie heißt der längste Fluss der Welt?", options: ["Amazonas", "Nil", "Jangtse", "Mississippi"], correct: 1, category: "land", emoji: "🌊" },
  { id: 15, question: "Welches Land ist für den Tango bekannt?", options: ["Brasilien", "Kolumbien", "Chile", "Argentinien"], correct: 3, category: "kultur", emoji: "💃" },
  { id: 16, question: "Was ist das höchste Gebirge der Welt?", options: ["Anden", "Alpen", "Himalaya", "Rocky Mountains"], correct: 2, category: "land", emoji: "🏔️" },
  { id: 17, question: "Welches Land hat die meisten Einwohner?", options: ["Indien", "China", "USA", "Indonesien"], correct: 0, category: "land", emoji: "👥" },
  { id: 18, question: "In welcher Stadt steht die Sagrada Família?", options: ["Madrid", "Barcelona", "Sevilla", "Valencia"], correct: 1, category: "kultur", emoji: "⛪" },
  { id: 19, question: "Welche Sprache wird in Brasilien gesprochen?", options: ["Spanisch", "Portugiesisch", "Englisch", "Französisch"], correct: 1, category: "kultur", emoji: "🇧🇷" },
  { id: 20, question: "Was ist die kleinste Hauptstadt der Welt?", options: ["Monaco", "Vaduz", "Ngerulmud", "San Marino"], correct: 2, category: "hauptstadt", emoji: "🏙️" },
  { id: 21, question: "In welchem Land liegt der Kilimandscharo?", options: ["Kenia", "Uganda", "Tansania", "Äthiopien"], correct: 2, category: "land", emoji: "🏔️" },
  { id: 22, question: "Welche Stadt wird 'Stadt der Lichter' genannt?", options: ["New York", "Paris", "Las Vegas", "Dubai"], correct: 1, category: "kultur", emoji: "✨" },
  { id: 23, question: "Welches ist das größte Korallenriff der Welt?", options: ["Mesoamerikanisches Riff", "Great Barrier Reef", "Nilambur Riff", "Andamanisches Riff"], correct: 1, category: "land", emoji: "🐠" },
  { id: 24, question: "In welchem Land liegt die Halbinsel Sinai?", options: ["Jordanien", "Israel", "Saudi-Arabien", "Ägypten"], correct: 3, category: "land", emoji: "🏜️" },
  { id: 25, question: "Wie heißt die Nationalfarbe der Niederlande?", options: ["Blau", "Grün", "Orange", "Gelb"], correct: 2, category: "kultur", emoji: "🇳🇱" },
  { id: 26, question: "Was ist die Hauptstadt von Kanada?", options: ["Toronto", "Vancouver", "Ottawa", "Montreal"], correct: 2, category: "hauptstadt", emoji: "🍁" },
  { id: 27, question: "Welches Gebäude steht in Agra, Indien?", options: ["Lotus-Tempel", "Taj Mahal", "Rotes Fort", "Qutub Minar"], correct: 1, category: "kultur", emoji: "🕌" },
  { id: 28, question: "Welches ist der tiefste See der Welt?", options: ["Kaspisches Meer", "Baikalsee", "Tanganjikasee", "Viktoriaasee"], correct: 1, category: "land", emoji: "💧" },
];

const QUIZ_LENGTH = 5;

function getDailyQuestions(): Question[] {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const shuffled = [...QUESTION_POOL].sort((a, b) =>
    ((a.id * 7 + dayOfYear) % 31) - ((b.id * 7 + dayOfYear) % 31)
  );
  return shuffled.slice(0, QUIZ_LENGTH);
}

function db() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

type Phase = "intro" | "playing" | "result";

export default function QuizTab({ user }: Props) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [questions] = useState<Question[]>(getDailyQuestions);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [todayScore, setTodayScore] = useState<{ score: number; max: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(15);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const today = new Date().toISOString().slice(0, 10);

  const loadTodayScore = useCallback(async () => {
    const { data } = await db()
      .from("trivia_scores")
      .select("score, max_score")
      .eq("user_id", user.uid)
      .eq("quiz_date", today)
      .maybeSingle();
    if (data) setTodayScore({ score: data.score, max: data.max_score });
    setLoading(false);
  }, [user.uid, today]);

  useEffect(() => { loadTodayScore(); }, [loadTodayScore]);

  const startTimer = useCallback(() => {
    setTimeLeft(15);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          // auto-advance after timeout
          setSelected(-1); // -1 = timed out
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    if (phase === "playing") startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase, current, startTimer]);

  const handleAnswer = (idx: number) => {
    if (selected !== null) return;
    clearInterval(timerRef.current!);
    setSelected(idx);
  };

  // After showing result for 1.5s, advance
  useEffect(() => {
    if (selected === null) return;
    const correct = selected === questions[current].correct;
    const timeout = setTimeout(() => {
      setAnswers((prev) => [...prev, correct]);
      if (current + 1 < questions.length) {
        setCurrent((c) => c + 1);
        setSelected(null);
        startTimer();
      } else {
        setPhase("result");
        // save score
        const totalCorrect = [...answers, correct].filter(Boolean).length;
        db().from("trivia_scores").upsert({
          user_id: user.uid,
          quiz_date: today,
          score: totalCorrect,
          max_score: QUIZ_LENGTH,
        }, { onConflict: "user_id,quiz_date" });
        setTodayScore({ score: totalCorrect, max: QUIZ_LENGTH });
      }
    }, 1400);
    return () => clearTimeout(timeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  if (loading) {
    return (
      <div className="space-y-4 max-w-2xl">
        <div className="h-8 bg-gray-100 rounded-xl animate-pulse w-48" />
        <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  const q = questions[current];

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
        <Brain className="w-5 h-5 text-indigo-500" />
        Daily Travel Quiz
      </h2>

      {/* Intro / already done */}
      {phase === "intro" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center space-y-5">
          {todayScore ? (
            <>
              <Trophy className="w-14 h-14 text-amber-400 mx-auto" />
              <h3 className="font-bold text-gray-900 text-xl">Heute bereits gespielt!</h3>
              <p className="text-gray-500">
                Du hast <strong>{todayScore.score}</strong> von <strong>{todayScore.max}</strong> Fragen richtig beantwortet.
              </p>
              <div className="flex justify-center gap-1">
                {Array.from({ length: todayScore.max }, (_, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    i < todayScore.score ? "bg-emerald-100" : "bg-red-100"
                  }`}>
                    {i < todayScore.score ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : <XCircle className="w-5 h-5 text-red-400" />}
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400">Morgen gibt es neue Fragen!</p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mx-auto">
                <Brain className="w-8 h-8 text-indigo-500" />
              </div>
              <h3 className="font-bold text-gray-900 text-xl">Teste dein Urlaubswissen!</h3>
              <p className="text-gray-500 text-sm">
                {QUIZ_LENGTH} Fragen · 15 Sekunden pro Frage · täglich neue Quizzes
              </p>
              <button
                onClick={() => setPhase("playing")}
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold px-8 py-3 rounded-2xl transition-colors shadow-md"
              >
                Quiz starten →
              </button>
            </>
          )}
        </div>
      )}

      {/* Playing */}
      {phase === "playing" && (
        <div className="space-y-4">
          {/* Progress + timer */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex gap-1.5">
              {questions.map((_, i) => (
                <div key={i} className={`h-1.5 w-8 rounded-full ${
                  i < current ? "bg-indigo-400" : i === current ? "bg-indigo-600" : "bg-gray-200"
                }`} />
              ))}
            </div>
            <div className={`flex items-center gap-1.5 font-bold tabular-nums ${
              timeLeft <= 5 ? "text-red-500" : "text-gray-600"
            }`}>
              <Clock className="w-4 h-4" />
              {timeLeft}s
            </div>
          </div>

          {/* Question */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <div className="text-xs text-indigo-500 font-semibold uppercase tracking-wide">
              {q.emoji} Frage {current + 1} / {questions.length}
            </div>
            <h3 className="font-bold text-gray-900 text-lg leading-snug">{q.question}</h3>

            <div className="grid grid-cols-1 gap-2.5">
              {q.options.map((opt, idx) => {
                let cls = "border-gray-200 bg-white text-gray-700 hover:border-indigo-300 hover:bg-indigo-50";
                if (selected !== null) {
                  if (idx === q.correct) cls = "border-emerald-400 bg-emerald-50 text-emerald-700";
                  else if (idx === selected && selected !== q.correct) cls = "border-red-400 bg-red-50 text-red-700";
                  else cls = "border-gray-100 bg-gray-50 text-gray-400";
                }
                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={selected !== null}
                    className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${cls}`}
                  >
                    <span className="font-bold mr-2 opacity-50">{String.fromCharCode(65 + idx)}.</span>
                    {opt}
                    {selected !== null && idx === q.correct && (
                      <CheckCircle className="inline w-4 h-4 text-emerald-500 ml-2" />
                    )}
                    {selected !== null && idx === selected && selected !== q.correct && (
                      <XCircle className="inline w-4 h-4 text-red-500 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Result */}
      {phase === "result" && todayScore && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center space-y-5">
          <div className="w-20 h-20 rounded-full bg-linear-to-br from-indigo-400 to-purple-500 flex items-center justify-center mx-auto shadow-lg">
            <Star className="w-10 h-10 text-white" />
          </div>
          <h3 className="font-bold text-gray-900 text-2xl">
            {todayScore.score} / {todayScore.max} richtig!
          </h3>
          <p className="text-gray-500 text-sm">
            {todayScore.score === todayScore.max && "Perfekt! Du bist ein echter Reise-Experte! 🏆"}
            {todayScore.score >= 3 && todayScore.score < todayScore.max && "Sehr gut! Morgen schaffst du es noch besser! 🌟"}
            {todayScore.score < 3 && "Nicht schlimm — morgen gibt es neue Fragen! 💪"}
          </p>
          <div className="flex justify-center gap-1.5">
            {answers.map((correct, i) => (
              <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center ${
                correct ? "bg-emerald-100" : "bg-red-100"
              }`}>
                {correct ? <CheckCircle className="w-6 h-6 text-emerald-500" /> : <XCircle className="w-6 h-6 text-red-400" />}
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
            <RotateCcw className="w-3 h-3" /> Morgen gibt es ein neues Quiz
          </p>
        </div>
      )}
    </div>
  );
}
