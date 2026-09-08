/* =========================================================
   GAME ZONE — SCRIPT
   ========================================================= */

const $ = (selector) => document.querySelector(selector);


/* =========================================================
   TOAST
   ========================================================= */

function toast(message) {
    const element = $("#toast");

    if (!element) return;

    element.textContent = message;
    element.classList.add("show");

    clearTimeout(window.gameZoneToastTimer);

    window.gameZoneToastTimer = setTimeout(() => {
        element.classList.remove("show");
    }, 2500);
}


/* =========================================================
   COMPTE JOUEUR
   ========================================================= */

function setName(name) {

    const nameElement = $("#name");
    const avatarElement = $("#avatar");
    const statusElement = $("#status");
    const loginButton = $("#login");

    if (nameElement) {
        nameElement.textContent = name;
    }

    if (avatarElement) {
        avatarElement.textContent =
            name.slice(0, 2).toUpperCase();
    }

    if (statusElement) {
        statusElement.textContent =
            "Compte local prêt. La liaison avec les jeux pourra être ajoutée plus tard.";
    }

    if (loginButton) {
        loginButton.textContent = "Modifier";
    }

    localStorage.setItem("gz_name", name);
}


/* =========================================================
   CHARGER LE NOM SAUVEGARDÉ
   ========================================================= */

const savedName = localStorage.getItem("gz_name");

if (savedName) {
    setName(savedName);
}


/* =========================================================
   MODALE DE CONNEXION
   ========================================================= */

const loginButton = $("#login");
const closeButton = $("#close");
const confirmButton = $("#ok");
const modal = $("#modal");
const playerInput = $("#player");


if (loginButton) {

    loginButton.addEventListener("click", () => {

        if (playerInput) {
            playerInput.value =
                localStorage.getItem("gz_name") || "";
        }

        if (modal) {
            modal.classList.remove("hidden");
        }
    });
}


if (closeButton) {

    closeButton.addEventListener("click", () => {

        if (modal) {
            modal.classList.add("hidden");
        }
    });
}


if (confirmButton) {

    confirmButton.addEventListener("click", () => {

        const name =
            playerInput ? playerInput.value.trim() : "";

        if (!name) {
            toast("Entre un nom de joueur.");
            return;
        }

        setName(name);

        if (modal) {
            modal.classList.add("hidden");
        }

        toast(
            "Bienvenue sur GAME ZONE, " +
            name +
            " !"
        );
    });
}


/* =========================================================
   FERMER LA MODALE EN CLIQUANT À L'EXTÉRIEUR
   ========================================================= */

if (modal) {

    modal.addEventListener("click", (event) => {

        if (event.target === modal) {
            modal.classList.add("hidden");
        }

    });
}


/* =========================================================
   BLOX FRUIT
   ========================================================= */

/*
   Fonctionnement :

   1. L'utilisateur clique sur
      "Jouer / Télécharger"

   2. GAME ZONE tente d'ouvrir :
      gamezone://bloxfruit

   3. Si l'application Blox Fruit est installée
      et reconnaît le lien → elle s'ouvre.

   4. Si rien ne s'ouvre après environ 1,5 seconde,
      GAME ZONE ouvre :

      download.html

   5. download.html pourra proposer :
      BloxFruit.apk
*/


const GAME_SCHEME = "gamezone://bloxfruit";
const DOWNLOAD_PAGE = "download.html";


function launchBloxFruit() {

    toast("Ouverture de Blox Fruit...");

    let appOpened = false;

    const visibilityHandler = () => {

        if (document.hidden) {
            appOpened = true;
        }

    };

    document.addEventListener(
        "visibilitychange",
        visibilityHandler
    );


    /*
       Tentative d'ouverture de l'APK
       via le Deep Link GAME ZONE.
    */

    try {

        window.location.href = GAME_SCHEME;

    } catch (error) {

        console.log(
            "Impossible d'ouvrir Blox Fruit :",
            error
        );

    }


    /*
       Après 1,5 seconde :
       si l'application ne semble pas
       s'être ouverte → page téléchargement.
    */

    setTimeout(() => {

        document.removeEventListener(
            "visibilitychange",
            visibilityHandler
        );

        if (!appOpened) {

            window.location.href = DOWNLOAD_PAGE;

        }

    }, 1500);
}


/* =========================================================
   BOUTON JOUER
   ========================================================= */

const playButton = $("#play");

if (playButton) {

    playButton.addEventListener(
        "click",
        launchBloxFruit
    );

}


/* =========================================================
   BOUTONS NON DISPONIBLES
   ========================================================= */

document
    .querySelectorAll(".disabled")
    .forEach((button) => {

        button.addEventListener("click", () => {

            toast(
                "Cette fonctionnalité n'est pas encore disponible."
            );

        });

    });


/* =========================================================
   NAVIGATION FLUIDE
   ========================================================= */

document
    .querySelectorAll('a[href^="#"]')
    .forEach((link) => {

        link.addEventListener("click", (event) => {

            const targetId =
                link.getAttribute("href");

            if (
                !targetId ||
                targetId === "#"
            ) {
                return;
            }

            const target =
                document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    });


/* =========================================================
   RACCOURCI ENTRÉE DANS LE NOM
   ========================================================= */

if (playerInput) {

    playerInput.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Enter" &&
                confirmButton
            ) {
                confirmButton.click();
            }

        }
    );

}


/* =========================================================
   CONSOLE
   ========================================================= */

console.log(
    "GAME ZONE chargé avec succès."
);

console.log(
    "Blox Fruit Deep Link :",
    GAME_SCHEME
);

console.log(
    "Page de secours :",
    DOWNLOAD_PAGE
);