import { useEffect, useState } from "react";
import "./App.css";

import foto01 from "./assets/fotos/foto01.jpg";
import foto02 from "./assets/fotos/foto02.jpg";
import foto03 from "./assets/fotos/foto03.jpg";
import foto04 from "./assets/fotos/foto04.jpg";
import foto05 from "./assets/fotos/foto05.jpg";
import foto06 from "./assets/fotos/foto06.jpg";
import foto07 from "./assets/fotos/foto07.jpg";
import foto08 from "./assets/fotos/foto08.jpg";
import foto09 from "./assets/fotos/foto09.jpg";
import foto10 from "./assets/fotos/foto10.jpg";
import foto11 from "./assets/fotos/foto11.jpg";
import foto12 from "./assets/fotos/foto12.jpg";

import cancion from "./assets/audio/cancion.mp3";


/* =========================================================
   FOTOGRAFÍAS
   ========================================================= */

const fotos = [
  foto01,
  foto02,
  foto03,
  foto04,
  foto05,
  foto06,
  foto07,
  foto08,
  foto09,
  foto10,
  foto11,
  foto12,
];


/* =========================================================
   FRASES
   ========================================================= */

const frases = [
  "Me encantas ❤️",
  "Te adoro ✨",
  "Eres muy especial para mí",
  "Me haces sonreír",
  "Qué bonito tenerte en mi vida",
  "Me encanta tu forma de ser",
];


/* =========================================================
   TRANSICIONES
   ========================================================= */

const transiciones = [
  "transition-fade",
  "transition-grid",
  "transition-wave",
  "transition-circle",
];


/* =========================================================
   TIEMPOS
   ========================================================= */

const TIEMPO_FOTO = 11000;
const TIEMPO_TRANSICION = 3000;


/* =========================================================
   CONTADOR DE REPRODUCCIONES
   ========================================================= */

const CLAVE_REPRODUCCIONES =
  "tarjeta_futurista_reproducciones";


function obtenerReproducciones() {
  try {
    const guardado =
      localStorage.getItem(
        CLAVE_REPRODUCCIONES
      );

    const numero = Number(guardado);

    if (
      Number.isFinite(numero) &&
      numero >= 0
    ) {
      return numero;
    }

    return 0;

  } catch (error) {

    console.log(
      "No se pudo leer el contador:",
      error
    );

    return 0;
  }
}


function guardarReproduccion() {
  try {

    const nuevoNumero =
      obtenerReproducciones() + 1;

    localStorage.setItem(
      CLAVE_REPRODUCCIONES,
      String(nuevoNumero)
    );

    return nuevoNumero;

  } catch (error) {

    console.log(
      "No se pudo guardar el contador:",
      error
    );

    return obtenerReproducciones();
  }
}


/* =========================================================
   APP
   ========================================================= */

function App() {

  /* =======================================================
     ESTADOS
     ======================================================= */

  const [opened, setOpened] =
    useState(false);

  const [currentPhoto, setCurrentPhoto] =
    useState(0);

  const [nextPhoto, setNextPhoto] =
    useState(1);

  const [currentPhrase, setCurrentPhrase] =
    useState(0);

  const [transition, setTransition] =
    useState("transition-fade");

  const [isTransitioning, setIsTransitioning] =
    useState(false);

  const [songFinished, setSongFinished] =
    useState(false);

  const [reproducciones, setReproducciones] =
    useState(obtenerReproducciones);


  /* =======================================================
     SISTEMA CINEMATOGRÁFICO DE FOTOS
     ======================================================= */

  useEffect(() => {

    if (!opened || songFinished) {
      return;
    }

    if (currentPhoto >= fotos.length - 1) {
      return;
    }

    let transitionTimer;
    let changeTimer;

    const comenzarTransicion = () => {

      const siguiente =
        currentPhoto + 1;

      setNextPhoto(siguiente);

      setTransition(
        transiciones[
          currentPhoto %
          transiciones.length
        ]
      );

      setIsTransitioning(true);

      changeTimer = setTimeout(() => {

        setCurrentPhoto(siguiente);

        setCurrentPhrase(
          (prev) =>
            (prev + 1) %
            frases.length
        );

        setIsTransitioning(false);

      }, TIEMPO_TRANSICION);
    };


    transitionTimer = setTimeout(
      comenzarTransicion,
      TIEMPO_FOTO
    );


    return () => {

      clearTimeout(
        transitionTimer
      );

      if (changeTimer) {
        clearTimeout(
          changeTimer
        );
      }

    };

  }, [
    opened,
    currentPhoto,
    songFinished,
  ]);


  /* =======================================================
     REPRODUCIR AUDIO
     ======================================================= */

  const reproducirAudio = () => {

    const audio =
      document.getElementById("music");

    if (!audio) {
      return;
    }

    audio.currentTime = 0;
    audio.volume = 0.65;

    audio.play().catch((error) => {

      console.log(
        "El navegador bloqueó el audio:",
        error
      );

    });
  };


  /* =======================================================
     ABRIR EXPERIENCIA
     ======================================================= */

  const abrirExperiencia = () => {

    /*
     * CADA VEZ QUE SE PULSA
     * "ABRIR ✨", AUMENTA EL CONTADOR.
     */

    const nuevoNumero =
      guardarReproduccion();

    setReproducciones(
      nuevoNumero
    );

    setOpened(true);

    setSongFinished(false);

    setCurrentPhoto(0);

    setNextPhoto(1);

    setCurrentPhrase(0);

    setTransition(
      "transition-fade"
    );

    setIsTransitioning(false);


    setTimeout(() => {

      reproducirAudio();

    }, 300);
  };


  /* =======================================================
     CUANDO TERMINA LA CANCIÓN
     ======================================================= */

  const terminarCancion = () => {

    setSongFinished(true);

    setIsTransitioning(false);

    setCurrentPhoto(
      fotos.length - 1
    );

    setNextPhoto(
      fotos.length - 1
    );

    setCurrentPhrase(0);
  };


  /* =======================================================
     VOLVER A SENTIR
     ======================================================= */

  const volverASentir = () => {

    /*
     * NO AUMENTAMOS EL CONTADOR.
     *
     * "VOLVER A SENTIR" ES PARTE
     * DE LA MISMA EXPERIENCIA.
     */

    const audio =
      document.getElementById("music");

    setSongFinished(false);

    setCurrentPhoto(0);

    setNextPhoto(1);

    setCurrentPhrase(0);

    setTransition(
      "transition-fade"
    );

    setIsTransitioning(false);


    setTimeout(() => {

      if (audio) {

        audio.currentTime = 0;

        audio.volume = 0.65;

        audio.play().catch((error) => {

          console.log(
            "El navegador bloqueó el audio:",
            error
          );

        });

      }

    }, 150);
  };


  /* =======================================================
     VOLVER AL INICIO
     ======================================================= */

  const volverAlInicio = () => {

    const audio =
      document.getElementById("music");

    if (audio) {

      audio.pause();

      audio.currentTime = 0;
    }


    setSongFinished(false);

    setIsTransitioning(false);

    setCurrentPhoto(0);

    setNextPhoto(1);

    setCurrentPhrase(0);

    setTransition(
      "transition-fade"
    );

    setOpened(false);
  };


  /* =======================================================
     RENDER
     ======================================================= */

  return (

    <main
      className={`app ${
        opened ? "opened" : ""
      }`}
    >

      {/* =================================================
          TARJETA INICIAL
         ================================================= */}

      {!opened && (

        <section className="love-card closed-card">

          {/* =================================================
              CONTADOR
             ================================================= */}

          <div className="play-counter">

            <span className="play-counter-title">
              ✦ REPRODUCCIONES
            </span>

            <span className="play-counter-number">
              {reproducciones}
            </span>

          </div>


          {/* =================================================
              BRILLO
             ================================================= */}

          <div className="card-glow"></div>


          {/* =================================================
              CORAZÓN
             ================================================= */}

          <div className="card-icon">
            ♥
          </div>


          {/* =================================================
              TÍTULO
             ================================================= */}

          <h1>
            Una sorpresa para ti
          </h1>


          {/* =================================================
              DESCRIPCIÓN
             ================================================= */}

          <p>
            Hay algo especial esperando dentro...
          </p>


          {/* =================================================
              BOTÓN
             ================================================= */}

          <button
            className="open-button"
            onClick={abrirExperiencia}
          >
            ABRIR ✨
          </button>

        </section>
      )}


      {/* =================================================
          EXPERIENCIA
         ================================================= */}

      {opened && (

        <section className="experience">

          {/* =================================================
              AUDIO
             ================================================= */}

          <audio
            id="music"
            src={cancion}
            preload="auto"
            onEnded={terminarCancion}
          />


          {/* =================================================
              ESTRELLAS
             ================================================= */}

          <div className="background-stars"></div>


          {/* =================================================
              PARTÍCULAS
             ================================================= */}

          <div className="floating-particles">

            <span>✦</span>
            <span>✧</span>
            <span>·</span>
            <span>✦</span>
            <span>·</span>
            <span>✧</span>

          </div>


          {/* =================================================
              CREADOR
             ================================================= */}

          <header className="creator-header">

            <span className="creator-line">
              ✦
            </span>

            <div>

              <strong>
                NELSON LAPIZAGA
              </strong>

              <small>
                CREADOR
              </small>

            </div>

            <span className="creator-line">
              ✦
            </span>

          </header>


          {/* =================================================
              MARCO PRINCIPAL
             ================================================= */}

          <div
            className={`cinematic-frame ${
              songFinished
                ? "final-frame"
                : ""
            }`}
          >

            <div className="frame-light frame-light-top"></div>

            <div className="frame-light frame-light-right"></div>

            <div className="frame-light frame-light-bottom"></div>

            <div className="frame-light frame-light-left"></div>


            {/* =================================================
                CONTENIDO
               ================================================= */}

            <div className="frame-inner">

              {/* =================================================
                  FOTO ACTUAL
                 ================================================= */}

              <div
                className={`photo-layer photo-current ${
                  songFinished
                    ? "final-photo-layer"
                    : ""
                }`}
              >

                <img
                  src={fotos[currentPhoto]}
                  alt={`Momento ${
                    currentPhoto + 1
                  }`}
                  className="main-photo"
                />

              </div>


              {/* =================================================
                  FOTO NUEVA
                 ================================================= */}

              {!songFinished &&
                isTransitioning && (

                  <div
                    className={`photo-layer photo-next ${transition}`}
                  >

                    <img
                      src={fotos[nextPhoto]}
                      alt={`Momento ${
                        nextPhoto + 1
                      }`}
                      className="main-photo"
                    />

                  </div>
                )}


              {/* =================================================
                  DESTELLO
                 ================================================= */}

              {!songFinished &&
                isTransitioning && (

                  <div className="transition-flash"></div>

                )}


              {/* =================================================
                  ESCENA FINAL
                 ================================================= */}

              {songFinished && (

                <div className="final-overlay">

                  <div className="final-glow"></div>

                  <div className="final-content">

                    <div className="final-symbol">
                      ✦
                    </div>

                    <h2>
                      Gracias por sentirlo
                    </h2>

                    <p>
                      Este momento queda contigo.
                    </p>

                    <div className="final-line"></div>

                    <div className="final-buttons">

                      <button
                        className="final-button primary"
                        onClick={volverASentir}
                      >
                        VOLVER A SENTIR ✨
                      </button>

                      <button
                        className="final-button secondary"
                        onClick={volverAlInicio}
                      >
                        VOLVER AL INICIO
                      </button>

                    </div>

                  </div>

                </div>
              )}

            </div>


            {/* =================================================
                DESTELLOS DEL MARCO
               ================================================= */}

            <div className="frame-spark spark-1">
              ✦
            </div>

            <div className="frame-spark spark-2">
              ✦
            </div>

            <div className="frame-spark spark-3">
              ✧
            </div>

            <div className="frame-spark spark-4">
              ✧
            </div>

          </div>


          {/* =================================================
              FRASE
             ================================================= */}

          {!songFinished && (

            <div
              key={currentPhrase}
              className="romantic-phrase"
            >
              {frases[currentPhrase]}
            </div>

          )}


          {/* =================================================
              PIE
             ================================================= */}

          <footer className="experience-footer">

            <div className="project-name">
              UNA SORPRESA PARA TI
            </div>

            <div className="project-subtitle">
              UNA EXPERIENCIA CREADA ESPECIALMENTE PARA TI
            </div>

            <div className="photo-counter">

              {String(
                currentPhoto + 1
              ).padStart(2, "0")}

              {" / "}

              {String(
                fotos.length
              ).padStart(2, "0")}

            </div>

          </footer>

        </section>
      )}

    </main>
  );
}


export default App;