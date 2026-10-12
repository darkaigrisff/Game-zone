
"use strict";

(function () {
  const auth = window.gzFirebaseAuth;
  const db = window.gzFirebaseDb;

  const ACCOUNTS = "gz_demo_accounts_v1";
  const SESSION = "gz_demo_session_v1";
  const LINKS = "gz_demo_links_v1";

  const $ = id => document.getElementById(id);

  function read(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
      return fallback;
    }
  }

  function localAccount(email) {
    return read(ACCOUNTS, []).find(
      a => a.email === email.toLowerCase()
    ) || null;
  }

  function localLinks(uid, oldId) {
    const all = read(LINKS, {});
    return all[uid] || (oldId ? all[oldId] || [] : []);
  }

  function setStatus(message) {
    const el = $("status");
    if (el) el.textContent = message;
  }

  function getUser() {
    return auth.currentUser;
  }

  function getPseudo(user) {
    return user?.displayName ||
      localAccount(user?.email || "")?.pseudo ||
      (user?.email || "Joueur").split("@")[0];
  }

  function wallet(user) {
    const old = localAccount(user?.email || "");
    if (old) {
      return Number(localStorage.getItem("gz_wallet_" + old.id)) || 0;
    }
    return 0;
  }

  function linksFor(user) {
    if (!user) return [];
    const old = localAccount(user.email || "");
    return localLinks(user.uid, old?.id);
  }

  function render() {
    const user = getUser();
    const pseudo = getPseudo(user);
    const email = user?.email || "";
    const links = linksFor(user);

    const form = $("authForms");
    const card = $("accountCard");

    if (form && card) {
      form.style.display = user ? "none" : "grid";
      card.style.display = user ? "block" : "none";
    }

    if ($("profileName")) $("profileName").textContent = pseudo;
    if ($("walletAmount")) {
      $("walletAmount").textContent =
        wallet(user).toLocaleString("fr-FR");
    }

    document.querySelectorAll("[data-gz-pseudo]").forEach(el => {
      el.textContent = user ? pseudo : "Invité";
    });

    document.querySelectorAll("[data-gz-wallet]").forEach(el => {
      el.textContent = wallet(user).toLocaleString("fr-FR");
    });

    if ($("gzHeaderPseudo")) {
      $("gzHeaderPseudo").textContent = user ? pseudo : "Connexion";
    }
    if ($("gzMenuPseudo")) {
      $("gzMenuPseudo").textContent = user ? pseudo : "Invité";
    }
    if ($("gzMenuEmail")) {
      $("gzMenuEmail").textContent =
        email || "Connecte-toi pour lier tes jeux";
    }
    if ($("gzAccountAction")) {
      $("gzAccountAction").textContent =
        user ? "Mon profil" : "Se connecter";
      $("gzAccountAction").href =
        user ? "compte.html" : "login.html";
    }
    if ($("gzMenuLogout")) $("gzMenuLogout").hidden = !user;

    document.querySelectorAll("[data-link-status]").forEach(el => {
      const slug = el.dataset.linkStatus;
      el.textContent = !user
        ? "Connecte-toi pour lier"
        : links.includes(slug)
          ? "Compte associé"
          : "Associer mon compte";
    });

    if ($("gzProfileButton")) {
      $("gzProfileButton").setAttribute(
        "aria-label",
        user ? "Profil de " + pseudo : "Se connecter à GAME ZONE"
      );
    }

    renderLinkManager();
  }

  async function saveProfile(user, pseudo) {
    try {
      const ref = db.collection("users").doc(user.uid);
      const snap = await ref.get();

      // Ne jamais écraser un profil cloud existant.
      if (!snap.exists) {
        await ref.set({
          pseudo: pseudo,
          email: user.email || "",
          linkedGames: [],
          createdAt: new Date().toISOString()
        });
      }

      return true;
    } catch (error) {
      console.error("Profil Firestore :", error);
      return false;
    }
  }

  async function register(e) {
    e.preventDefault();

    const pseudo = $("regPseudo")?.value.trim() || "";
    const email = $("regEmail")?.value.trim().toLowerCase() || "";
    const password = $("regPassword")?.value || "";

    if (pseudo.length < 3 || password.length < 8) {
      setStatus("Pseudo : 3 caractères minimum. Mot de passe : 8 minimum.");
      return;
    }

    try {
      const credential =
        await auth.createUserWithEmailAndPassword(email, password);

      await credential.user.updateProfile({
        displayName: pseudo
      });

      const saved = await saveProfile(credential.user, pseudo);

      setStatus(saved
        ? "Compte créé et profil enregistré !"
        : "Compte créé ! La synchronisation du profil attend la configuration des règles Firestore."
      );

      render();
      setTimeout(() => {
        window.location.href = "home.html";
      }, 1200);
    } catch (error) {
      console.error(error);
      setStatus(error.code === "auth/email-already-in-use"
        ? "Cet e-mail possède déjà un compte. Connecte-toi."
        : error.code === "auth/weak-password"
          ? "Choisis un mot de passe plus robuste."
          : error.code === "auth/invalid-email"
            ? "L'adresse e-mail n'est pas valide."
            : "Inscription impossible : " + (error.message || error.code)
      );
    }
  }

  async function login(e) {
    e.preventDefault();

    const email = $("loginEmail")?.value.trim().toLowerCase() || "";
    const password = $("loginPassword")?.value || "";

    try {
      const credential =
        await auth.signInWithEmailAndPassword(email, password);

      const user = credential.user;
      const old = localAccount(email);

      // Reprendre le pseudo local si le profil Firebase n'en a pas.
      if (!user.displayName && old?.pseudo) {
        await user.updateProfile({ displayName: old.pseudo });
      }

      const saved = await saveProfile(
        user,
        getPseudo(user)
      );

      setStatus(saved
        ? "Connexion réussie !"
        : "Connexion réussie ! La synchronisation du profil attend les règles Firestore."
      );

      render();
      setTimeout(() => {
        window.location.href = "home.html";
      }, 1000);
    } catch (error) {
      console.error(error);
      setStatus(error.code === "auth/invalid-credential"
        ? "E-mail ou mot de passe incorrect."
        : "Connexion impossible : " + (error.message || error.code)
      );
    }
  }

  async function logout() {
    try {
      await auth.signOut();
      window.location.href = "home.html";
    } catch (error) {
      setStatus("Déconnexion impossible. Réessaie.");
      console.error(error);
    }
  }

  function renderLinkManager() {
    const user = getUser();
    const gate = $("accountMessage");

    if (!document.querySelector("[data-toggle-link]")) return;

    if (!user) {
      if ($("profilePseudo")) $("profilePseudo").textContent = "Invité";
      if ($("profileEmail")) {
        $("profileEmail").textContent =
          "Connecte-toi pour associer tes jeux.";
      }
      document.querySelectorAll("[data-toggle-link]").forEach(button => {
        button.textContent = "Connexion";
        button.disabled = false;
      });
      if (gate) gate.textContent =
        "Connecte-toi à GAME ZONE avant de lier un jeu.";
      return;
    }

    const pseudo = getPseudo(user);
    if ($("profilePseudo")) $("profilePseudo").textContent = pseudo;
    if ($("profileEmail")) $("profileEmail").textContent = user.email || "";
    if ($("profileAvatar")) {
      $("profileAvatar").textContent = pseudo.slice(0, 2).toUpperCase();
    }

    const linked = linksFor(user);

    [
      ["bloxfruit", "bloxStatus", "bloxLinkButton"],
      ["space", "spaceStatus", "spaceLinkButton"]
    ].forEach(([slug, statusId, buttonId]) => {
      const yes = linked.includes(slug);
      const status = $(statusId);
      const button = $(buttonId);

      if (status) {
        status.textContent = yes
          ? "Compte GAME ZONE associé"
          : "Compte non associé";
        status.classList.toggle("linked-pill", yes);
      }

      if (button) {
        button.textContent = yes ? "Délier" : "Lier";
        button.disabled = false;
        button.classList.toggle("btn-primary", !yes);
      }
    });

    if (gate) {
      gate.textContent =
        "Les associations sont encore locales en attendant leur synchronisation cloud.";
    }
  }

  async function toggleLink(button) {
    const user = getUser();

    if (!user) {
      window.location.href = "login.html";
      return;
    }

    const slug = button.dataset.toggleLink;
    if (!["bloxfruit", "space"].includes(slug)) return;

    const old = localAccount(user.email || "");
    const all = read(LINKS, {});
    const arr = localLinks(user.uid, old?.id);
    const next = arr.includes(slug)
      ? arr.filter(item => item !== slug)
      : [...arr, slug];

    // Conserver la compatibilité locale sans effacer les anciennes données.
    all[user.uid] = next;
    localStorage.setItem(LINKS, JSON.stringify(all));

    render();
  }

  if ($("registerForm")) {
    $("registerForm").addEventListener("submit", register);
  }
  if ($("loginForm")) {
    $("loginForm").addEventListener("submit", login);
  }
  if ($("logoutBtn")) {
    $("logoutBtn").addEventListener("click", logout);
  }
  if ($("gzMenuLogout")) {
    $("gzMenuLogout").addEventListener("click", logout);
  }

  document.querySelectorAll("[data-toggle-link]").forEach(button => {
    button.addEventListener("click", () => toggleLink(button));
  });

  document.querySelectorAll("[data-link-game]").forEach(link => {
    link.addEventListener("click", e => {
      if (!getUser()) {
        e.preventDefault();
        window.location.href = "login.html";
      }
    });
  });

  auth.onAuthStateChanged(user => {
    render();
    if (user) {
      saveProfile(user, getPseudo(user)).then(render);
    }
  });

  window.GZAccount = {
    getSession: getUser,
    getWallet: () => wallet(getUser()),
    render,
    logout
  };
})();

