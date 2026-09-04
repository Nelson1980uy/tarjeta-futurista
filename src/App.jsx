import { useEffect, useState } from "react";
import "./App.css";

import videoParaTi from "./assets/video/parati.mp4";
import colibriImg from "./assets/colibri/colibri.png";
import colibriSound from "./assets/colibri/colibri.mp3";



/* =========================================================
   FRASES
   ========================================================= */

const frases = [
  "Me encantas ❤️",
  "Te adoro ✨",
  "Eres muy especial para mí",
  "Me haces sonreír",
  "Qué bonito tenerte en mi vida",
  "Me encanta tu forma de ser"
];


/* =========================================================
   TRANSICIONES
   ========================================================= */

const transiciones = [
  "transition-fade",
  "transition-grid",
  "transition-wave",
  "transition-circle"
];


/* =========================================================
   TIEMPOS
   ========================================================= */

const TIEMPO_FOTO = 11000;
const TIEMPO_TRANSICION = 3000;


/* =========================================================
   CONTADORES
   ========================================================= */

const CLAVE_REPRODUCCIONES =
  "tarjeta_futurista_reproducciones";

const CLAVE_DESCARGAS =
  "tarjeta_futurista_descargas";


function obtenerReproducciones() {
  try {
    const guardado = localStorage.getItem(
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


function obtenerDescargas() {

  try {

    const guardado =
      localStorage.getItem(
        CLAVE_DESCARGAS
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
      "No se pudo leer el contador de descargas:",
      error
    );

    return 0;
  }
}


function guardarDescarga() {

  try {

    const nuevoNumero =
      obtenerDescargas() + 1;

    localStorage.setItem(
      CLAVE_DESCARGAS,
      String(nuevoNumero)
    );

    return nuevoNumero;

  } catch (error) {

    console.log(
      "No se pudo guardar el contador de descargas:",
      error
    );

    return obtenerDescargas();
  }
}


/* =========================================================
   APP
   ========================================================= */

function App() {


  /* =======================================================
     ESTADOS DE CARGA
     ======================================================= */

  const [imagenesCargadas, setImagenesCargadas] =
    useState([]);

  const [audioCargado, setAudioCargado] =
    useState(null);

  const [configuracionLista, setConfiguracionLista] =
    useState(false);

    const [colibriActivo, setColibriActivo] =
  useState(false);

const [inicial1, setInicial1] = useState("");
const [inicial2, setInicial2] = useState("");



  /* =======================================================
     ESTADOS DE LA EXPERIENCIA
     ======================================================= */

  const [introFinished, setIntroFinished] =
    useState(false);

  const [videoStarted, setVideoStarted] =
    useState(false);

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


  /* =======================================================
     CONTADORES
     ======================================================= */

  const [reproducciones, setReproducciones] =
    useState(obtenerReproducciones);

  const [descargas, setDescargas] =
    useState(obtenerDescargas);


  /* =======================================================
     LIMPIAR URLS TEMPORALES
     ======================================================= */

  useEffect(() => {

    return () => {

      imagenesCargadas.forEach((imagen) => {

        URL.revokeObjectURL(
          imagen.url
        );

      });

      if (audioCargado) {

        URL.revokeObjectURL(
          audioCargado.url
        );

      }

    };

  }, []);


  /* =======================================================
     CARGAR 20+ IMÁGENES
     ======================================================= */

  const manejarImagenes = (event) => {

    const archivos =
      Array.from(event.target.files || []);


    const imagenesValidas =
      archivos.filter((archivo) =>
        archivo.type.startsWith("image/")
      );


    if (imagenesValidas.length < 20) {

      alert(
        "Debes seleccionar como mínimo 20 fotografías."
      );

      event.target.value = "";

      return;
    }


    /* =====================================================
       LIBERAR IMÁGENES ANTERIORES
       ===================================================== */

    imagenesCargadas.forEach((imagen) => {

      URL.revokeObjectURL(
        imagen.url
      );

    });


    /* =====================================================
       CREAR URLS
       ===================================================== */

    const nuevasImagenes =
      imagenesValidas.map(
        (archivo, indice) => ({

          id:
            `${archivo.name}-${archivo.lastModified}-${indice}`,

          archivo,

          url:
            URL.createObjectURL(
              archivo
            )

        })
      );


    setImagenesCargadas(
      nuevasImagenes
    );


    setConfiguracionLista(false);


    event.target.value = "";
  };


  /* =======================================================
     CARGAR AUDIO MP3 / MP4
     ======================================================= */

  const manejarAudio = (event) => {

    const archivo =
      event.target.files?.[0];


    if (!archivo) {
      return;
    }


    const esAudio =
      archivo.type.startsWith("audio/");

    const esMp3 =
      archivo.name.toLowerCase().endsWith(".mp3");

    const esMp4 =
      archivo.name.toLowerCase().endsWith(".mp4");


    if (!esAudio && !esMp3 && !esMp4) {

      alert(
        "Por favor selecciona un archivo MP3 o MP4."
      );

      event.target.value = "";

      return;
    }


    if (audioCargado) {

      URL.revokeObjectURL(
        audioCargado.url
      );

    }


    const nuevaURL =
      URL.createObjectURL(
        archivo
      );


    setAudioCargado({

      archivo,

      url: nuevaURL

    });


    setConfiguracionLista(false);


    event.target.value = "";
  };


  /* =======================================================
     VALIDAR CONFIGURACIÓN
     ======================================================= */

  const validarConfiguracion = () => {

    if (imagenesCargadas.length < 20) {

      alert(
        "Necesitas cargar como mínimo 20 fotografías."
      );

      return;
    }


    if (!audioCargado) {

      alert(
        "Necesitas cargar una música MP3 o MP4."
      );

      return;
    }


    setConfiguracionLista(
      true
    );
  };


  /* =======================================================
     INICIAR VIDEO
     ======================================================= */

  /* =======================================================
   INICIAR SECUENCIA DEL PICAFOLOR
   ======================================================= */

const iniciarVideo = () => {

  // Evita que el usuario pueda activar
  // la animación varias veces
  if (colibriActivo) {
    return;
  }


  // Activar picaflor
  setColibriActivo(true);


  // Reproducir sonido del picaflor
  const sonidoColibri =
    new Audio(colibriSound);

  sonidoColibri.volume = 0.35;

  sonidoColibri.play().catch(
    (error) => {

      console.log(
        "El navegador no pudo reproducir el sonido del picaflor:",
        error
      );

    }
  );


  /*
   * Duración total de la escena:
   *
   * 0s     → aparece
   * 1.5s   → vuela hacia el corazón
   * 3.0s   → gira alrededor
   * 4.5s   → segundo movimiento
   * 6.5s   → se marcha
   *
   * Después comienza el video.
   */

  setTimeout(() => {

    setColibriActivo(false);

    setVideoStarted(true);

  }, 6500);
};


  /* =======================================================
     CUANDO TERMINA EL VIDEO
     ======================================================= */

  const terminarVideo = () => {

    setVideoStarted(
      false
    );

    setIntroFinished(
      true
    );
  };


  /* =======================================================
     SISTEMA CINEMATOGRÁFICO
     ======================================================= */

  useEffect(() => {

    if (
      !opened ||
      songFinished ||
      imagenesCargadas.length === 0
    ) {
      return;
    }


    let transitionTimer = null;
    let changeTimer = null;


    const comenzarTransicion = () => {

      const siguiente =
        (currentPhoto + 1) %
        imagenesCargadas.length;


      setNextPhoto(
        siguiente
      );


      setTransition(
        transiciones[
          currentPhoto %
          transiciones.length
        ]
      );


      setIsTransitioning(
        true
      );


      changeTimer =
        setTimeout(() => {

          setCurrentPhoto(
            siguiente
          );


          setCurrentPhrase(
            (prev) =>
              (prev + 1) %
              frases.length
          );


          setIsTransitioning(
            false
          );

        }, TIEMPO_TRANSICION);
    };


    transitionTimer =
      setTimeout(
        comenzarTransicion,
        TIEMPO_FOTO
      );


    return () => {

      if (transitionTimer) {

        clearTimeout(
          transitionTimer
        );

      }


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
    imagenesCargadas.length
  ]);


  /* =======================================================
     REPRODUCIR AUDIO
     ======================================================= */

  const reproducirAudio = () => {

    const audio =
      document.getElementById(
        "music"
      );


    if (!audio) {
      return;
    }


    audio.currentTime = 0;

    audio.volume = 0.65;


    audio.play().catch(
      (error) => {

        console.log(
          "El navegador bloqueó el audio:",
          error
        );

      }
    );
  };


  /* =======================================================
     ABRIR EXPERIENCIA
     ======================================================= */

  const abrirExperiencia = () => {

    const nuevoNumero =
      guardarReproduccion();


    setReproducciones(
      nuevoNumero
    );


    setOpened(
      true
    );


    setSongFinished(
      false
    );


    setCurrentPhoto(
      0
    );


    setNextPhoto(
      1
    );


    setCurrentPhrase(
      0
    );


    setTransition(
      "transition-fade"
    );


    setIsTransitioning(
      false
    );


    setTimeout(() => {

      reproducirAudio();

    }, 300);
  };


  /* =======================================================
     DESCARGAR AUDIO
     ======================================================= */

  const descargarAudio = () => {

    const nuevoNumero =
      guardarDescarga();


    setDescargas(
      nuevoNumero
    );
  };


  /* =======================================================
     TERMINAR CANCIÓN
     ======================================================= */

  const terminarCancion = () => {

    setSongFinished(
      true
    );


    setIsTransitioning(
      false
    );


    setCurrentPhoto(
      imagenesCargadas.length - 1
    );


    setNextPhoto(
      imagenesCargadas.length - 1
    );


    setCurrentPhrase(
      0
    );
  };


  /* =======================================================
     VOLVER A SENTIR
     ======================================================= */

  const volverASentir = () => {

    const audio =
      document.getElementById(
        "music"
      );


    setSongFinished(
      false
    );


    setCurrentPhoto(
      0
    );


    setNextPhoto(
      1
    );


    setCurrentPhrase(
      0
    );


    setTransition(
      "transition-fade"
    );


    setIsTransitioning(
      false
    );


    setTimeout(() => {

      if (audio) {

        audio.currentTime = 0;

        audio.volume = 0.65;


        audio.play().catch(
          (error) => {

            console.log(
              "El navegador bloqueó el audio:",
              error
            );

          }
        );

      }

    }, 150);
  };


  /* =======================================================
     VOLVER AL INICIO
     ======================================================= */

  const volverAlInicio = () => {

    const audio =
      document.getElementById(
        "music"
      );


    if (audio) {

      audio.pause();

      audio.currentTime = 0;

    }


    setSongFinished(
      false
    );


    setIsTransitioning(
      false
    );


    setCurrentPhoto(
      0
    );


    setNextPhoto(
      1
    );


    setCurrentPhrase(
      0
    );


    setTransition(
      "transition-fade"
    );


    setOpened(
      false
    );


    setVideoStarted(
      false
    );


    setIntroFinished(
      false
    );
  };


  /* =======================================================
     RENDER
     ======================================================= */

  return (

    <main
      className={`app ${
        opened
          ? "opened"
          : ""
      }`}
    >


      {/* =================================================
          PANTALLA DE CONFIGURACIÓN
         ================================================= */}

      {!configuracionLista && (

        <section className="upload-screen">

          <div className="upload-background"></div>

          <div className="upload-glow"></div>


          <div className="upload-card">

            <div className="upload-symbol">
              ✦
            </div>


            <h1>
              BIENVENIDO
            </h1>


            <h2>
              PREPARA TU SORPRESA
            </h2>


            <p className="upload-description">
              Antes de abrir la experiencia,
              debes cargar tus recuerdos.
            </p>


            <div className="upload-requirements">

              <div className="upload-requirement">

                <span className="upload-requirement-icon">
                  📸
                </span>

                <div>

                  <strong>
                    FOTOGRAFÍAS
                  </strong>

                  <small>
                    Mínimo 20 imágenes
                  </small>

                </div>

              </div>


              <div className="upload-requirement">

                <span className="upload-requirement-icon">
                  🎵
                </span>

                <div>

                  <strong>
                    MÚSICA
                  </strong>

                  <small>
                    MP3 o MP4
                  </small>

                </div>

              </div>

            </div>


            {/* =================================================
                FOTOS
               ================================================= */}

            <label
              className="upload-button"
            >

              <span>
                📸
              </span>

              <strong>
                SELECCIONAR FOTOGRAFÍAS
              </strong>

              <small>
                Puedes seleccionar 20 o más
              </small>

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={manejarImagenes}
                hidden
              />

            </label>


            <div className="upload-status">

              {imagenesCargadas.length === 0 ? (

                <span>
                  ✦ Aún no has cargado fotografías
                </span>

              ) : (

                <span className="upload-success">
                  ✓ {imagenesCargadas.length} fotografías cargadas
                </span>

              )}

            </div>


            {/* =================================================
                AUDIO
               ================================================= */}

            <label
              className="upload-button"
            >

              <span>
                🎵
              </span>

              <strong>
                SELECCIONAR MÚSICA
              </strong>

              <small>
                MP3 o MP4
              </small>

              <input
                type="file"
                accept=".mp3,.mp4,audio/*,video/mp4"
                onChange={manejarAudio}
                hidden
              />

            </label>


            <div className="upload-status">

              {!audioCargado ? (

                <span>
                  ✦ Aún no has seleccionado música
                </span>

              ) : (

                <span className="upload-success">
                  ✓ Música preparada:
                  {" "}
                  {audioCargado.archivo.name}
                </span>

              )}

            </div>


            {/* =================================================
                PREVISUALIZACIÓN
               ================================================= */}

            {imagenesCargadas.length > 0 && (

              <div className="upload-preview">

                {imagenesCargadas
                  .slice(0, 8)
                  .map((imagen) => (

                    <img
                      key={imagen.id}
                      src={imagen.url}
                      alt="Vista previa"
                    />

                  ))}

                {imagenesCargadas.length > 8 && (

                  <div className="upload-more">
                    +{imagenesCargadas.length - 8}
                  </div>

                )}

              </div>

            )}


            {/* =================================================
                BOTÓN CONTINUAR
               ================================================= */}

            <button
              className="upload-continue-button"
              onClick={validarConfiguracion}
              disabled={
                imagenesCargadas.length < 20 ||
                !audioCargado
              }
            >

              {imagenesCargadas.length >= 20 &&
              audioCargado
                ? "CONTINUAR ✦"
                : "CARGA 20 FOTOS Y UNA MÚSICA"
              }

            </button>


            <p className="upload-private">
              ✦ Tus archivos se utilizan únicamente
              para crear esta experiencia en tu navegador.
            </p>

          </div>

        </section>

      )}


      {/* =================================================
          SOBRE PREMIUM
         ================================================= */}

      {configuracionLista &&
!introFinished &&
!videoStarted && (

  <section className="envelope-intro">

    <div className="premium-envelope-background"></div>

    <div className="premium-envelope-glow"></div>


    <div
      className={`premium-envelope-scene ${
        colibriActivo
          ? "colibri-active"
          : ""
      }`}
    >


      <div className="premium-envelope">

        <div className="premium-envelope-top-glow"></div>

        <div className="premium-envelope-flap"></div>


        <div className="premium-envelope-front">

          <div className="premium-envelope-seal">

            <span>
              ♥
            </span>

          </div>


          <div className="premium-envelope-label">

            <span className="premium-envelope-title">
              PARA TI
            </span>


            <span className="premium-envelope-line">
              ✦
            </span>


            <span className="premium-envelope-subtitle">
              UNA SORPRESA ESPECIAL
            </span>

          </div>

        </div>


        <div className="premium-envelope-shine"></div>

      </div>


      {/* =================================================
          BOTÓN ABRIR
         ================================================= */}

      <button
        className={`premium-envelope-button ${
          colibriActivo
            ? "colibri-button-active"
            : ""
        }`}
        onClick={iniciarVideo}
        disabled={colibriActivo}
      >

        <span className="premium-envelope-button-text">

          {colibriActivo
            ? "ESPERA..."
            : "ABRIR"}

        </span>


        <span className="premium-envelope-button-heart">
          ♥
        </span>

      </button>


      {/* =================================================
          PICAFOLOR
         ================================================= */}

      {colibriActivo && (

        <div
          className="colibri-scene"
          aria-hidden="true"
        >

          <div className="colibri-aura"></div>


          <div className="colibri-flower">

            <span className="flower-petal petal-1">
              ✿
            </span>

            <span className="flower-petal petal-2">
              ✿
            </span>

            <span className="flower-center">
              ✦
            </span>

          </div>


          <div className="colibri-flight">

            <img
              src={colibriImg}
              alt=""
              className="colibri-bird"
            />

          </div>

        </div>

      )}

    </div>

  </section>

)}


      {/* =================================================
          VIDEO
         ================================================= */}

      {videoStarted && (

        <section className="video-intro">

          <div className="video-cinematic-frame">


            <div className="video-frame-light video-frame-light-top"></div>

            <div className="video-frame-light video-frame-light-right"></div>

            <div className="video-frame-light video-frame-light-bottom"></div>

            <div className="video-frame-light video-frame-light-left"></div>


            <div className="video-frame-inner">

              <video
                className="intro-video"
                src={videoParaTi}
                autoPlay
                playsInline
                controls={false}
                onEnded={terminarVideo}
              />

            </div>


            <div className="video-frame-spark video-spark-1">
              ✦
            </div>

            <div className="video-frame-spark video-spark-2">
              ✦
            </div>

            <div className="video-frame-spark video-spark-3">
              ✧
            </div>

            <div className="video-frame-spark video-spark-4">
              ✧
            </div>

          </div>

        </section>

      )}


      {/* =================================================
          TARJETA INICIAL
         ================================================= */}

      {introFinished &&
      !opened && (

        <section className="love-card closed-card">

          <div className="play-counter">

            <span className="play-counter-title">
              ✦ REPRODUCCIONES
            </span>

            <span className="play-counter-number">
              {reproducciones}
            </span>

          </div>


          <div className="card-glow"></div>


          {/* =================================================
    SELECTOR DE INICIALES — RUEDITAS
   ================================================= */}

<div className="initials-selector">

  <div className="initials-title">
    ELIGE TUS INICIALES
  </div>

  {/* PRIMERA LETRA */}
  <div className="wheel-selector">

    <span className="initial-label">
      PRIMERA LETRA
    </span>

    <div className="letter-wheel">

      <button
        type="button"
        className="wheel-arrow"
        onClick={() => {
          const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
          const actual = inicial1 || "A";
          const posicion = letras.indexOf(actual);
          const anterior =
            letras[
              (posicion - 1 + letras.length) %
              letras.length
            ];

          setInicial1(anterior);
        }}
      >
        ‹
      </button>

      <div className="wheel-center">
        <span className="wheel-letter">
          {inicial1 || "A"}
        </span>
      </div>

      <button
        type="button"
        className="wheel-arrow"
        onClick={() => {
          const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
          const actual = inicial1 || "A";
          const posicion = letras.indexOf(actual);
          const siguiente =
            letras[
              (posicion + 1) %
              letras.length
            ];

          setInicial1(siguiente);
        }}
      >
        ›
      </button>

    </div>

  </div>


  {/* SEGUNDA LETRA */}
  <div className="wheel-selector">

    <span className="initial-label">
      SEGUNDA LETRA
    </span>

    <div className="letter-wheel">

      <button
        type="button"
        className="wheel-arrow"
        onClick={() => {
          const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
          const actual = inicial2 || "A";
          const posicion = letras.indexOf(actual);
          const anterior =
            letras[
              (posicion - 1 + letras.length) %
              letras.length
            ];

          setInicial2(anterior);
        }}
      >
        ‹
      </button>

      <div className="wheel-center">
        <span className="wheel-letter">
          {inicial2 || "A"}
        </span>
      </div>

      <button
        type="button"
        className="wheel-arrow"
        onClick={() => {
          const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
          const actual = inicial2 || "A";
          const posicion = letras.indexOf(actual);
          const siguiente =
            letras[
              (posicion + 1) %
              letras.length
            ];

          setInicial2(siguiente);
        }}
      >
        ›
      </button>

    </div>

  </div>


  {/* CORAZÓN */}

  <div className="card-icon">

    <span className="heart-symbol">
      ♥
    </span>

    <span className="heart-initials">
      {inicial1 || "•"}
      {" "}
      {inicial2 || "•"}
    </span>

  </div>

</div>


          <h1>
            Esto es para ti
          </h1>


          <p>
            Hay algo especial esperando dentro...
          </p>


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
              AUDIO DEL USUARIO
             ================================================= */}

          <audio
            id="music"
            src={audioCargado?.url}
            preload="auto"
            onEnded={terminarCancion}
          />


          <div className="background-stars"></div>


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
    {inicial1 || "A"} {inicial2 || "A"}
  </strong>

  <small>
    {audioCargado?.archivo?.name || "TU AUDIO"}
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
                  src={
                    imagenesCargadas[
                      currentPhoto
                    ]?.url
                  }
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
                    src={
                      imagenesCargadas[
                        nextPhoto
                      ]?.url
                    }
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


                    {/* =================================================
                        AUDIO ORIGINAL
                       ================================================= */}

                    <div className="audio-download">

                      <div className="audio-download-label">
                        ✦ AUDIO ORIGINAL
                      </div>


                      <div className="audio-download-title">
                        Tu música especial
                      </div>


                      <div className="audio-download-author">
                        {audioCargado?.archivo?.name}
                      </div>


                      <div className="audio-download-bottom">

                        <div className="audio-download-counter">

                          <span className="audio-download-counter-symbol">
                            ↓
                          </span>

                          <span className="audio-download-counter-number">
                            {descargas}
                          </span>

                        </div>


                        <a
                          className="audio-download-button"
                          href={audioCargado?.url}
                          download={
                            audioCargado?.archivo?.name ||
                            "audio-especial.mp3"
                          }
                          onClick={descargarAudio}
                        >
                          DESCARGAR AUDIO ↓
                        </a>

                      </div>

                    </div>


                    {/* =================================================
                        BOTONES FINALES
                       ================================================= */}

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
                DESTELLOS
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
                imagenesCargadas.length
              ).padStart(2, "0")}

            </div>

          </footer>


        </section>

      )}

    </main>
  );
}


export default App;