"use client";

import { useState, useEffect } from "react";
import CynefinSelector from "./CynefinSelector";
import TriviaResults from "./TriviaResults";

interface TriviaQuestion {
  id: number;
  question: string;
  correctAnswer: "simple" | "complicado" | "complejo" | "caotico";
  feedback: string;
}

const triviaQuestions: TriviaQuestion[] = [
  {
    id: 1,
    question: "Una lider coordina un equipo que realiza tareas administrativas ya estandarizadas. Deben completarse de manera unívoca una serie de items para pasar una auditoría.",
    correctAnswer: "simple",
    feedback: "Parece ser un entorno simple. Se aplica una lista de chequeo y el resultado es binario (cumple / no cumple).",
  },
  {
    id: 2,
    question: "La empresa quiere reducir la rotación de personas jóvenes. No existe una causa evidente: aparecen diferencias según equipo, liderazgo y momento de carrera. RRHH decide probar distintas intervenciones en algunos equipos y observar qué sucede.",
    correctAnswer: "complejo",
    feedback: "Se trata de un entorno complejo. La problemática no es unívoca y el resultado de nuestras intervenciones no es tan fácilmente predecible. Hay que experimentar con nuevos esquemas y ver qué resulta más efectivo.",
  },
  {
    id: 3,
    question: "Una empresa necesita seleccionar a una persona para un puesto de especialista en cyberseguridad. El equipo de reclutamiento no puede determinar por sí solo el nivel técnico de los candidatos, por lo cual incorpora especialistas para evaluar sus conocimientos.",
    correctAnswer: "complicado",
    feedback: "Estamos en un entorno complicado. No hay un solo procedimiento estandar, requerimos la experiencia de personas idoneas para evaluar la mejor opción de contratación.",
  },
  {
    id: 4,
    question: "Un error en el sistema de liquidación de sueldos provoca que cientos de empleados reciban información incorrecta sobre sus pagos y comiencen a reclamar simultaneamente.",
    correctAnswer: "caotico",
    feedback: "Claramente, es un contexto caótico. Hay que actuar de inmediato para contener la situación, entender qué sucedió y priorizar la velocidad de la respuesta por sobre lo exhaustivo de la misma.",
  },
  {
    id: 5,
    question: "Una lider recibe el pedido de implementar una nueva iniciativa de calidad que es nueva para la organización. Convoca a dos especialistas, analizan distintas alternativas y a partir de su experiencia determinan el procedimiento a seguir. ",
    correctAnswer: "complicado",
    feedback: "Con seguridad, es un entorno complicado. No hay una receta universal: depende del diagnóstico experto, una persona capacitada puede identificar diferentes alternativas y asesorarnos para optar por la mejor.",
  },
  {
    id: 6,
    question: "Una lider nota que su equipo está teniendo dificultades para colaborar. No existe una causa evidente: cada integrante interpreta la situación de una manera diferente. La lider decide probar una nueva dinámica de reuniones durante algunas semanas y observar qué efectos produce.",
    correctAnswer: "complejo",
    feedback: "Parece ser un entorno complejo. No hay parámetros que definan el resultado esperable. El desafío no es sólo técnico, sino cultural y organizacional. Las resistencias, los aprendizajes y los efectos emergen a medida que se experimenta con el sistema.",
  }
];

// Función para mezclar un array usando el algoritmo Fisher-Yates
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

interface TriviaProps {
  resultsText?: string;
}

export default function Trivia({ resultsText = "En apenas unos minutos ya fortaleciste tus competencias para diagnosticar escenarios y desarrollar estrategias posibles. <br/><br/>Ahora imaginate todo lo qué vas a poder aprender en nuestro taller de graduates.<br/><br/><b>Te esperamos para seguir entrenando!</b>" }: TriviaProps) {
  // Mezclar las preguntas una sola vez al montar el componente
  const [shuffledQuestions] = useState<TriviaQuestion[]>(() => shuffleArray(triviaQuestions));

  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);

  const handleAnswer = (domain: string) => {
    if (!showFeedback) {
      setSelectedDomain(domain);
      const isCorrect = domain === currentQuestion.correctAnswer;
      setAnswers(prev => [...prev, isCorrect]);
      setShowFeedback(true);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedDomain(null);
        setShowFeedback(false);
        // Pequeño delay para que la nueva pregunta aparezca
        setTimeout(() => {
          setIsTransitioning(false);
        }, 50);
      }, 300);
    }
  };

  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  const isCorrect = selectedDomain === currentQuestion.correctAnswer;

  // Avance automático después de 2.5 segundos cuando se muestra el feedback
  useEffect(() => {
    if (showFeedback) {
      const timer = setTimeout(() => {
        if (currentQuestionIndex < shuffledQuestions.length - 1) {
          // Primero ocultar la pregunta y el feedback
          setIsTransitioning(true);
          // Luego cambiar la pregunta después de la animación de fade out
          setTimeout(() => {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedDomain(null);
            setShowFeedback(false);
            // Pequeño delay para que la nueva pregunta aparezca
            setTimeout(() => {
              setIsTransitioning(false);
            }, 50);
          }, 300); // Tiempo de la animación de fade out
        } else {
          // Última pregunta completada
          setIsFinished(true);
        }
      }, 5500); // Esperar 2.5 segundos mostrando el feedback

      return () => clearTimeout(timer);
    }
  }, [showFeedback, currentQuestionIndex, shuffledQuestions.length]);


  const finalScore = answers.filter(Boolean).length;

  // Función helper para obtener el color del dominio
  const getDomainColor = (domain: string) => {
    const colors: { [key: string]: string } = {
      simple: '#4D9D44',
      complicado: '#009EDC',
      complejo: '#004F6E',
      caotico: '#000000'
    };
    return colors[domain] || '#000000';
  };

  return (
    <div className="relative mb-24" style={{ minHeight: '400px' }}>
      <div
        key={currentQuestionIndex}
        className={`bg-white rounded-[24px] p-8 md:p-8 md:pl-20 md:pt-20 pb-16 flex 
          flex-col md:flex-row gap-8 md:gap-16 relative z-10 will-change-transform max-w-[1200px] 
          md:mx-auto mx-4  overflow-hidden ${isFinished ? 'mb-12' : ''}`}
      >
        {/* Seguidor de progreso - arriba en móvil, dentro del texto en desktop */}
        <div className="md:hidden mb-4 order-0">
          <div className="text-sm text-gray-500 mb-2">
            Pregunta {currentQuestionIndex + 1} de {shuffledQuestions.length}
          </div>
          {/* Barra de progreso */}
          <div className="w-full bg-gray-200 h-2 overflow-hidden">
            <div
              className="bg-black h-2 rounded-full transition-all duration-300 ease-out"
              style={{
                width: `${((currentQuestionIndex + 1) / shuffledQuestions.length) * 100}%`
              }}
            />
          </div>
        </div>

        {/* Selector Cynefin - arriba en móvil (25% más chico), 1/3 del ancho en desktop */}
        <div className="w-full md:w-1/3 flex-shrink-0 order-1 md:order-2 h-fit">
          <div className="scale-75 md:scale-100 origin-top md:origin-center">
            <CynefinSelector
              handleClick={handleAnswer}
              disabled={showFeedback || isFinished}
              highlightDomain={showFeedback || isFinished ? (currentQuestion.correctAnswer as any) : null}
              selectedDomain={showFeedback || isFinished ? (selectedDomain as any) : null}
            />
          </div>
        </div>

        {/* Texto de la pregunta - abajo en móvil, 2/3 del ancho en desktop */}
        <div className={`w-full md:w-2/3 text-[18px] leading-6 md:leading-relaxed md:mt-4 mt-[-70px] order-2 md:order-1`}>
          {/* Seguidor de progreso - solo visible en desktop */}
          <div className="hidden md:block mb-4">
            <div className="text-sm text-gray-500 mb-2">
              Pregunta {currentQuestionIndex + 1} de {shuffledQuestions.length}
            </div>
            {/* Barra de progreso */}
            <div className="w-full bg-gray-200 h-2 overflow-hidden">
              <div
                className="bg-black h-2 rounded-full transition-all duration-300 ease-out"
                style={{
                  width: `${((currentQuestionIndex + 1) / shuffledQuestions.length) * 100}%`
                }}
              />
            </div>
          </div>
          <p className={`md:mt-12 italic transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'
            }`}>
            {currentQuestion.question}
            <br /><br />
            ¿En qué dominio nos encontramos?
          </p>

          {/* Feedback */}
          {showFeedback && (
            <div className={`mt-6 rounded-lg transition-all duration-300`}>
              <p className={`italic text-md ${'text-ldc-' + currentQuestion.correctAnswer}`}>
                {isCorrect ? "¡Correcto! " : "Incorrecto. "} {currentQuestion.feedback}
              </p>
              {/* Indicador circular de progreso - solo si no es la última pregunta */}
              {currentQuestionIndex < shuffledQuestions.length - 1 && (
                <div className="mt-2">
                  <svg width="16" height="16" className="transform -rotate-90" style={{ color: getDomainColor(currentQuestion.correctAnswer) }}>
                    <circle
                      cx="8"
                      cy="8"
                      r="7"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      style={{ opacity: 0.3 }}
                    />
                    <circle
                      cx="8"
                      cy="8"
                      r="7"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeDasharray="43.98"
                      strokeDashoffset="0"
                      style={{
                        animation: 'progressCircle 5.5s linear forwards',
                      }}
                    />
                  </svg>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Sección de resultados debajo del cuadrito */}
      {isFinished && (
        <TriviaResults
          finalScore={finalScore}
          totalQuestions={shuffledQuestions.length}
          resultsText={resultsText}
        />
      )}
    </div>
  );
}

