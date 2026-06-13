import { useState, useEffect, useRef } from 'react'
import './index.css'

const CHECKOUT_URL = 'https://ggcheckout.app/checkout/v5/7F0uplXKgxD3b1Y0y7D7'

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'Qual área da sua vida você mais deseja transformar?',
    options: [
      { icon: '💰', label: 'Prosperidade financeira' },
      { icon: '❤️', label: 'Relacionamentos' },
      { icon: '✨', label: 'Autoestima e confiança' },
      { icon: '🚀', label: 'Crescimento pessoal' },
    ],
  },
  {
    id: 2,
    question: 'Você sente que seus esforços raramente geram os resultados que deseja?',
    options: [
      { icon: '✅', label: 'Sim' },
      { icon: '🔄', label: 'Às vezes' },
      { icon: '🌱', label: 'Raramente' },
      { icon: '❌', label: 'Não' },
    ],
  },
  {
    id: 3,
    question: 'Com que frequência pensamentos negativos aparecem em sua mente?',
    options: [
      { icon: '😊', label: 'Quase nunca' },
      { icon: '📅', label: 'Algumas vezes por semana' },
      { icon: '📆', label: 'Todos os dias' },
      { icon: '🔁', label: 'Diversas vezes por dia' },
    ],
  },
  {
    id: 4,
    question: 'Você acredita que merece viver a vida que deseja?',
    options: [
      { icon: '💯', label: 'Sim totalmente' },
      { icon: '🌗', label: 'Em parte' },
      { icon: '🤔', label: 'Tenho dúvidas' },
      { icon: '😔', label: 'Não' },
    ],
  },
  {
    id: 5,
    question: 'Qual dessas situações mais representa você atualmente?',
    options: [
      { icon: '💼', label: 'Trabalho muito e não prospero' },
      { icon: '🚧', label: 'Sempre encontro obstáculos' },
      { icon: '🔒', label: 'Sinto que algo me bloqueia' },
      { icon: '⚡', label: 'Quero acelerar meus resultados' },
    ],
  },
]

const PROCESSING_STEPS = [
  'Analisando suas respostas...',
  'Identificando padrões subconscientes...',
  'Calculando perfil comportamental...',
  'Gerando resultado personalizado...',
]

const TESTIMONIALS = [
  {
    text: '"Passei a enxergar oportunidades que antes ignorava e comecei a agir com mais confiança."',
    author: 'Mariana S.',
    stars: 5,
  },
  {
    text: '"As técnicas me ajudaram a organizar meus pensamentos e focar melhor nos meus objetivos."',
    author: 'Carlos M.',
    stars: 5,
  },
  {
    text: '"Foi um divisor de águas para meu desenvolvimento pessoal."',
    author: 'Fernanda R.',
    stars: 5,
  },
]

const FAQ_ITEMS = [
  {
    question: 'Esse conteúdo é para iniciantes?',
    answer: 'Sim. O material foi desenvolvido para pessoas em qualquer nível de conhecimento.',
  },
  {
    question: 'Quanto tempo preciso dedicar?',
    answer: 'As técnicas podem ser aplicadas em poucos minutos por dia.',
  },
  {
    question: 'Receberei acesso imediato?',
    answer: 'Sim. Após a confirmação da compra, o acesso será disponibilizado conforme as instruções da plataforma.',
  },
]

// ─── Circular Progress Meter ────────────────────────────────────────────────
function CircularMeter({ value }) {
  const radius = 70
  const circumference = 2 * Math.PI * radius
  const [displayed, setDisplayed] = useState(0)
  const [offset, setOffset] = useState(circumference)

  useEffect(() => {
    const timer = setTimeout(() => {
      setOffset(circumference - (value / 100) * circumference)
    }, 300)
    const counter = setInterval(() => {
      setDisplayed(prev => {
        if (prev >= value) { clearInterval(counter); return value }
        return prev + 1
      })
    }, 20)
    return () => { clearTimeout(timer); clearInterval(counter) }
  }, [value, circumference])

  return (
    <div className="relative flex items-center justify-center" style={{ width: 180, height: 180 }}>
      <svg width="180" height="180" className="-rotate-90">
        <circle cx="90" cy="90" r={radius} fill="none" stroke="rgba(109,40,217,0.2)" strokeWidth="10" />
        <circle
          cx="90" cy="90" r={radius} fill="none"
          stroke="url(#meterGrad)" strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
        />
        <defs>
          <linearGradient id="meterGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6D28D9" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-black text-gradient">{displayed}%</span>
        <span className="text-xs text-slate-400 mt-1 text-center leading-tight">Potencial de<br/>Manifestação</span>
      </div>
    </div>
  )
}

// ─── FAQ Item ────────────────────────────────────────────────────────────────
function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="glass rounded-2xl overflow-hidden mb-3">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left gap-4"
      >
        <span className="font-semibold text-white text-sm sm:text-base">{question}</span>
        <span className={`text-violet-400 text-xl flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-45' : ''}`}>+</span>
      </button>
      {open && (
        <div className="px-5 pb-5 text-slate-300 text-sm leading-relaxed border-t border-white/5 pt-4">
          {answer}
        </div>
      )}
    </div>
  )
}

// ─── Main App ────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState('intro') // intro | quiz | processing | result
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState([])
  const [processingStep, setProcessingStep] = useState(0)
  const [onlineCount, setOnlineCount] = useState(37)
  const [score] = useState(() => Math.floor(Math.random() * (94 - 72 + 1)) + 72)
  const [selectedOption, setSelectedOption] = useState(null)
  const resultRef = useRef(null)

  // Dynamic online counter
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount(Math.floor(Math.random() * (43 - 17 + 1)) + 17)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  // Processing animation
  useEffect(() => {
    if (screen !== 'processing') return
    let step = 0
    const interval = setInterval(() => {
      step++
      if (step < PROCESSING_STEPS.length) {
        setProcessingStep(step)
      } else {
        clearInterval(interval)
        setTimeout(() => setScreen('result'), 500)
      }
    }, 1100)
    return () => clearInterval(interval)
  }, [screen])

  // Scroll to top on screen change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [screen])

  function handleStart() {
    setScreen('quiz')
    setCurrentQ(0)
    setAnswers([])
  }

  function handleBack() {
    if (screen === 'quiz' && currentQ > 0) {
      setCurrentQ(currentQ - 1)
      setAnswers(answers.slice(0, -1))
      setSelectedOption(null)
    } else {
      setScreen('intro')
      setCurrentQ(0)
      setAnswers([])
      setSelectedOption(null)
    }
  }

  function handleAnswer(optionIndex) {
    if (selectedOption !== null) return
    setSelectedOption(optionIndex)
    setTimeout(() => {
      const newAnswers = [...answers, optionIndex]
      setAnswers(newAnswers)
      setSelectedOption(null)
      if (currentQ < QUIZ_QUESTIONS.length - 1) {
        setCurrentQ(currentQ + 1)
      } else {
        setScreen('processing')
        setProcessingStep(0)
      }
    }, 500)
  }

  const progress = ((currentQ + (selectedOption !== null ? 1 : 0)) / QUIZ_QUESTIONS.length) * 100

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0F172A' }}>

      {/* ── INTRO ── */}
      {screen === 'intro' && (
        <div className="animate-fadeInUp px-4 py-10 max-w-2xl mx-auto flex flex-col items-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 text-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300">Diagnóstico Gratuito</span>
          </div>

          {/* Floating orbs decoration */}
          <div className="relative w-full flex justify-center mb-8">
            <div className="absolute w-64 h-64 rounded-full opacity-20 animate-float"
              style={{ background: 'radial-gradient(circle, #6D28D9, transparent)', filter: 'blur(60px)' }}></div>
            <div className="relative z-10 text-center">
              <div className="text-6xl mb-4">🧠</div>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl font-black text-center leading-tight mb-4 uppercase tracking-tight">
            Descubra o que está{' '}
            <span className="text-gradient">bloqueando</span>{' '}
            suas manifestações
          </h1>

          <p className="text-slate-300 text-center text-base sm:text-lg leading-relaxed mb-8 max-w-lg">
            Em apenas <strong className="text-white">60 segundos</strong>, descubra quais padrões subconscientes podem estar impedindo você de atrair prosperidade, oportunidades e realização pessoal.
          </p>

          {/* Benefits */}
          <div className="glass rounded-2xl p-5 w-full max-w-md mb-8">
            {['Diagnóstico personalizado', 'Resultado imediato', 'Apenas 1 minuto'].map((b, i) => (
              <div key={i} className={`flex items-center gap-3 ${i > 0 ? 'mt-3' : ''}`}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #6D28D9, #F59E0B)' }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-white font-medium text-sm">{b}</span>
              </div>
            ))}
          </div>

          {/* Online counter */}
          <div className="flex items-center gap-2 mb-8">
            <div className="flex -space-x-2">
              {['bg-violet-500','bg-amber-500','bg-emerald-500'].map((c,i) => (
                <div key={i} className={`w-7 h-7 rounded-full ${c} border-2 border-slate-900 flex items-center justify-center text-xs text-white font-bold`}>
                  {['M','C','A'][i]}
                </div>
              ))}
            </div>
            <p className="text-slate-400 text-sm">
              <span className="text-amber-400 font-bold transition-all duration-500">{onlineCount}</span>{' '}
              pessoas estão realizando este diagnóstico agora
            </p>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleStart}
            className="gradient-btn w-full max-w-md py-5 rounded-2xl text-white font-black text-lg uppercase tracking-wider glow-purple"
          >
            Começar Diagnóstico Gratuito
            <span className="ml-2">→</span>
          </button>

          <p className="text-slate-500 text-xs mt-4 text-center">
            100% gratuito · Sem cadastro · Resultado imediato
          </p>
        </div>
      )}

      {/* ── QUIZ ── */}
      {screen === 'quiz' && (
        <div className="animate-scaleIn px-4 py-8 max-w-2xl mx-auto">

          {/* Back button */}
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-200 mb-4 group"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="group-hover:-translate-x-1 transition-transform duration-200">
              <path d="M11 14l-5-5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-sm font-medium">Voltar</span>
          </button>

          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-slate-400 mb-2">
              <span>Pergunta {currentQ + 1} de {QUIZ_QUESTIONS.length}</span>
              <span>{Math.round(progress)}% concluído</span>
            </div>
            <div className="w-full h-2 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
              <div
                className="h-2 rounded-full transition-all duration-700"
                style={{
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #6D28D9, #9333EA, #F59E0B)',
                }}
              ></div>
            </div>
          </div>

          {/* Question card */}
          <div key={currentQ} className="animate-fadeInUp">
            <div className="glass rounded-3xl p-6 sm:p-8 mb-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #6D28D9, #9333EA)' }}>
                  {currentQ + 1}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                  {QUIZ_QUESTIONS[currentQ].question}
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {QUIZ_QUESTIONS[currentQ].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    className={`flex items-center gap-4 p-4 rounded-2xl text-left transition-all duration-300 border ${
                      selectedOption === i
                        ? 'border-violet-500 scale-95'
                        : 'border-white/10 hover:border-violet-400/50 hover:scale-[1.02]'
                    }`}
                    style={{
                      backgroundColor: selectedOption === i
                        ? 'rgba(109,40,217,0.25)'
                        : 'rgba(255,255,255,0.04)',
                    }}
                  >
                    <span className="text-2xl flex-shrink-0">{opt.icon}</span>
                    <span className="text-white font-medium text-sm sm:text-base">{opt.label}</span>
                    {selectedOption === i && (
                      <div className="ml-auto w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #6D28D9, #F59E0B)' }}>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── PROCESSING ── */}
      {screen === 'processing' && (
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="animate-scaleIn text-center max-w-sm w-full">
            {/* Animated loader */}
            <div className="relative w-32 h-32 mx-auto mb-8">
              <div className="absolute inset-0 rounded-full animate-spin-slow"
                style={{ border: '3px solid transparent', borderTopColor: '#6D28D9', borderRightColor: '#F59E0B' }}></div>
              <div className="absolute inset-3 rounded-full animate-pulse"
                style={{ background: 'linear-gradient(135deg, rgba(109,40,217,0.3), rgba(245,158,11,0.3))' }}></div>
              <div className="absolute inset-0 flex items-center justify-center text-4xl">🧠</div>
            </div>

            <h2 className="text-2xl font-bold text-white mb-6">Processando seu perfil</h2>

            <div className="space-y-3">
              {PROCESSING_STEPS.map((step, i) => (
                <div key={i}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-500 ${
                    i <= processingStep ? 'opacity-100' : 'opacity-20'
                  }`}
                  style={{ backgroundColor: i <= processingStep ? 'rgba(109,40,217,0.15)' : 'transparent' }}
                >
                  <div className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center ${
                    i < processingStep ? 'bg-emerald-500' : i === processingStep ? 'animate-pulse' : 'bg-slate-700'
                  }`}
                    style={i === processingStep ? { background: 'linear-gradient(135deg,#6D28D9,#F59E0B)' } : {}}>
                    {i < processingStep && (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5l2.5 2.5 3.5-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span className={`text-sm ${i <= processingStep ? 'text-white' : 'text-slate-600'}`}>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── RESULT ── */}
      {screen === 'result' && (
        <div ref={resultRef} className="animate-fadeInUp px-4 py-8 max-w-2xl mx-auto">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4 text-sm">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span className="text-amber-400 font-semibold">Diagnóstico Concluído</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
              Seu Diagnóstico Está <span className="text-gradient">Pronto</span>
            </h1>
          </div>

          {/* Circular Meter */}
          <div className="flex justify-center mb-6">
            <div className="glass rounded-3xl p-8 flex flex-col items-center glow-purple">
              <CircularMeter value={score} />
            </div>
          </div>

          {/* Analysis text */}
          <div className="glass rounded-2xl p-6 mb-4">
            <p className="text-slate-300 leading-relaxed text-sm sm:text-base mb-4">
              Com base nas suas respostas, identificamos sinais de padrões mentais que podem estar <strong className="text-white">limitando sua capacidade</strong> de atrair oportunidades, prosperidade e crescimento pessoal.
            </p>
            <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
              A boa notícia é que esses padrões podem ser <strong className="text-white">trabalhados e transformados</strong> através de técnicas de desenvolvimento mental e reprogramação subconsciente.
            </p>
          </div>

          {/* Highlight box */}
          <div className="rounded-2xl p-5 mb-8 border"
            style={{ background: 'linear-gradient(135deg, rgba(109,40,217,0.2), rgba(245,158,11,0.1))', borderColor: 'rgba(109,40,217,0.4)' }}>
            <div className="flex gap-3">
              <span className="text-2xl flex-shrink-0">⚡</span>
              <p className="text-white text-sm sm:text-base leading-relaxed font-medium">
                Seu perfil demonstra <strong className="text-amber-400">alto potencial de evolução</strong> quando utiliza métodos estruturados para fortalecer foco, confiança e alinhamento mental.
              </p>
            </div>
          </div>

          {/* What you'll discover */}
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-black text-white text-center uppercase tracking-tight mb-5">
              O Que Você Vai <span className="text-gradient">Descobrir</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                ['🔍', 'Como identificar crenças limitantes'],
                ['💪', 'Como fortalecer sua mentalidade'],
                ['🎯', 'Técnicas práticas de visualização'],
                ['📈', 'Exercícios de desenvolvimento pessoal'],
                ['❤️', 'Como alinhar emoções e objetivos'],
                ['🌟', 'Como desenvolver hábitos mentais mais positivos'],
              ].map(([icon, text], i) => (
                <div key={i} className="glass rounded-2xl p-4 flex items-start gap-3">
                  <span className="text-xl flex-shrink-0">{icon}</span>
                  <span className="text-white text-sm font-medium leading-snug">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Offer section */}
          <div className="glass rounded-3xl p-6 sm:p-8 mb-6 border"
            style={{ borderColor: 'rgba(109,40,217,0.3)' }}>
            <h2 className="text-xl sm:text-2xl font-black text-white text-center uppercase tracking-tight mb-4">
              Seu Próximo <span className="text-gradient">Passo</span>
            </h2>
            <p className="text-slate-300 text-center text-sm sm:text-base mb-5 leading-relaxed">
              Com base nas suas respostas, recomendamos o método completo:
            </p>
            <div className="rounded-2xl p-5 text-center mb-5"
              style={{ background: 'linear-gradient(135deg, rgba(109,40,217,0.25), rgba(147,51,234,0.15))' }}>
              <div className="text-3xl mb-2">🧠✨</div>
              <h3 className="text-lg sm:text-xl font-black text-white leading-snug">
                "O Poder do Subconsciente –<br/>Ativando a Lei da Atração"
              </h3>
            </div>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed text-center">
              Este material foi criado para ajudar pessoas a desenvolverem uma <strong className="text-white">mentalidade mais alinhada</strong> com seus objetivos, fortalecendo foco, autoconfiança e crescimento pessoal.
            </p>
          </div>

          {/* CTA Button */}
          <a
            href={CHECKOUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="gradient-btn block w-full py-5 rounded-2xl text-white font-black text-lg sm:text-xl uppercase tracking-wider text-center glow-gold mb-3"
          >
            Quero Acessar Agora 🔓
          </a>
          <p className="text-slate-500 text-xs text-center mb-10">
            Acesso imediato · Pagamento seguro · Satisfação garantida
          </p>

          {/* Testimonials */}
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-black text-white text-center uppercase tracking-tight mb-5">
              O Que Nossos <span className="text-gradient">Alunos Relatam</span>
            </h2>
            <div className="space-y-3">
              {TESTIMONIALS.map((t, i) => (
                <div key={i} className="glass rounded-2xl p-5">
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: t.stars }).map((_, s) => (
                      <span key={s} className="text-amber-400 text-sm">★</span>
                    ))}
                  </div>
                  <p className="text-slate-200 text-sm leading-relaxed italic mb-3">{t.text}</p>
                  <p className="text-slate-400 text-xs font-semibold">— {t.author}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="mb-10">
            <h2 className="text-xl sm:text-2xl font-black text-white text-center uppercase tracking-tight mb-5">
              Perguntas <span className="text-gradient">Frequentes</span>
            </h2>
            {FAQ_ITEMS.map((item, i) => (
              <FaqItem key={i} question={item.question} answer={item.answer} />
            ))}
          </div>

          {/* Footer */}
          <div className="border-t pt-8 pb-6 text-center" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <p className="text-slate-500 text-xs leading-relaxed max-w-md mx-auto">
              Este conteúdo possui finalidade educacional e de desenvolvimento pessoal. Não são feitas promessas de ganhos financeiros, resultados garantidos ou transformações específicas. Os resultados variam conforme a dedicação e aplicação individual de cada pessoa.
            </p>
          </div>
        </div>
      )}

      {/* ── Sticky CTA on mobile (result screen) ── */}
      {screen === 'result' && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-3 sm:hidden"
          style={{ background: 'linear-gradient(to top, #0F172A 60%, transparent)' }}>
          <a
            href={CHECKOUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="gradient-btn block w-full py-4 rounded-2xl text-white font-black text-base uppercase tracking-wider text-center glow-purple"
          >
            Quero Acessar Agora 🔓
          </a>
        </div>
      )}
    </div>
  )
}
