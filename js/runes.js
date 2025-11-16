/* ============================================================
   runes.js — Tirages runiques Holistic-Studio
   - Elder Futhark complet (24 runes)
   - Lecture puriste + psycho + analyse Jarvis
   - Tirages 1 / 3 / 5 / 9 runes
   - Axe runique personnel (Lifetime, tirage 9)
   ============================================================ */

(function () {
  const { hs$, createSeed, mulberry32 } = window.HS_utils;
  const { getAccessLevel, isPremium, isLifetime } = window.HS_premium;

  /* -------- 1. Base de données des 24 runes -------- */

  const ELDER_FUTHARK = [
    {
      key: "fehu",
      name: "Fehu",
      oldNorse: "fé",
      phonetic: "Fé-hou",
      translation: "Richesse mobile, bétail",
      keywords: ["richesse", "flux", "départ", "énergie vitale", "abondance circulante"],
      purist:
        "Fehu représente la richesse mobile dans le monde ancien : le bétail, les biens qui se déplacent, la prospérité en mouvement. " +
        "Elle ouvre le Futhark comme la force vitale qui commence à circuler, la possibilité de nourrir, d’échanger, de donner et de recevoir.",
      psychology:
        "Psychologiquement, Fehu interroge ton rapport aux ressources : argent, énergie, temps, attention. " +
        "Elle montre là où tu donnes trop sans retour, là où tu te retiens par peur du manque, et là où tu peux remettre du mouvement pour ne plus t’épuiser.",
      analyst:
        "Analyse Jarvis : Fehu t’invite à cartographier tes flux (financiers, émotionnels, relationnels). " +
        "Là où l’énergie stagne, il y a surcharge ou fuite ; là où elle circule de façon alignée, tu crées un rendement durable.",
      reversedHint:
        "Risque de pertes, fuite d’énergie, investissement mal orienté ou stagnation des ressources.",
      shadow:
        "Accumuler par peur de manquer, confondre valeur personnelle et possessions, rester esclave de ce que tu possèdes."
    },
    {
      key: "uruz",
      name: "Uruz",
      oldNorse: "úr",
      phonetic: "Ou-rouz",
      translation: "Aurochs, force brute",
      keywords: ["force", "vitalité", "courage", "mutation", "puissance du corps"],
      purist:
        "Uruz évoque l’aurochs, animal puissant et indompté, symbole de la force brute de la nature. " +
        "Elle parle du potentiel vital disponible pour traverser les épreuves, guérir, transformer ton destin par l’endurance et le courage.",
      psychology:
        "Psychologiquement, Uruz te met face à ta puissance intérieure, souvent sous-estimée ou mal canalisée. " +
        "Elle questionne ton rapport au corps, à la santé, à la confiance physique, et à ta capacité à affronter ce que tu évites.",
      analyst:
        "Analyse Jarvis : Uruz indique une fenêtre de transformation concrète. " +
        "En agissant sur les routines (sommeil, alimentation, mouvement, limites), tu peux convertir une période difficile en augmentation de puissance.",
      reversedHint:
        "Perte de vitalité, fatigue, opportunités de croissance non saisies, peur d’entrer en action.",
      shadow:
        "Confondre force et brutalité, user de sa puissance contre soi-même ou contre les autres, ne pas respecter ses limites réelles."
    },
    {
      key: "thurisaz",
      name: "Thurisaz",
      oldNorse: "þurs",
      phonetic: "Thouri-saz",
      translation: "Géant, force de rupture",
      keywords: ["rupture", "protection", "seuil", "danger", "tri nécessaire"],
      purist:
        "Thurisaz est liée aux géants (þurs), forces brutes, ambivalentes, destructrices et protectrices. " +
        "Elle marque les seuils, les moments de choc où quelque chose doit être coupé, trié, tenu à distance pour protéger ce qui est vivant.",
      psychology:
        "Psychologiquement, Thurisaz parle de colère, de défense, de limites non respectées. " +
        "Elle met en lumière ce que tu tolères trop longtemps, ce que tu ressens comme une attaque, et la manière dont tu peux passer du subir au choisir.",
      analyst:
        "Analyse Jarvis : Thurisaz signale un point de rupture qu’il vaut mieux gérer consciemment. " +
        "Soit tu encaisses en silence jusqu’à l’explosion, soit tu canalises cette énergie pour poser un cadre clair, même inconfortable sur le moment.",
      reversedHint:
        "Explosion incontrôlée, auto-sabotage, agressivité mal dirigée, conflit évitable mal géré.",
      shadow:
        "Rester en guerre permanente, chercher un ennemi partout, dépenser son énergie à lutter contre tout au lieu d’ouvrir un chemin."
    },
    {
      key: "ansuz",
      name: "Ansuz",
      oldNorse: "áss",
      phonetic: "Ann-souz",
      translation: "Dieu, souffle, parole inspirée",
      keywords: ["communication", "inspiration", "guidance", "enseignement", "message"],
      purist:
        "Ansuz est liée aux Ases, aux dieux, à la parole inspirée et au souffle sacré. " +
        "Elle gouverne le langage, la transmission, l’oracle, tout ce qui passe par la voix, le chant, le conseil, l’enseignement.",
      psychology:
        "Psychologiquement, Ansuz questionne ta voix : ce que tu dis, ce que tu tais, la manière dont tu communiques et te trahis ou te respectes dans tes paroles. " +
        "Elle pointe les non-dits, les discours appris qui ne sont plus les tiens, et le besoin de parler juste.",
      analyst:
        "Analyse Jarvis : Ansuz indique qu’un message, une information ou une conversation clé est au cœur de la situation. " +
        "En clarifiant ce que tu veux réellement dire (et entendre), tu peux déverrouiller un scénario bloqué.",
      reversedHint:
        "Mensonges, malentendus, manipulation, communication brouillée ou parole vidée de sens.",
      shadow:
        "Parler pour remplir le vide, utiliser le verbe pour dominer ou séduire, refuser d’écouter autant que l’on parle."
    },
    {
      key: "raidho",
      name: "Raidho",
      oldNorse: "reið",
      phonetic: "Raï-do",
      translation: "Chemin, voyage",
      keywords: ["chemin", "voyage", "rythme", "justice", "processus"],
      purist:
        "Raidho concerne le voyage, la route, la procession rituelle. " +
        "Elle symbolise le fait d’avancer selon un ordre juste, en respectant les étapes, le rythme et la cohérence du chemin.",
      psychology:
        "Psychologiquement, Raidho interroge ton rapport au timing : impatience, sentiment de retard, peur d’être « à côté de ta route ». " +
        "Elle parle de ton degré de confiance dans le fait que ton parcours ait un sens, même s’il ne ressemble pas à un plan parfait.",
      analyst:
        "Analyse Jarvis : Raidho t’invite à revoir ton itinéraire plutôt que de forcer l’arrivée. " +
        "En ajustant les étapes, l’organisation, la cadence, tu peux rendre ton trajet plus viable et moins épuisant.",
      reversedHint:
        "Impression de blocage, détour forcé, injustice ressentie, sentiment d’être hors trajectoire.",
      shadow:
        "Vouloir tout contrôler, refuser les pauses et les ajustements, vivre comme une compétition permanente."
    },
    {
      key: "kenaz",
      name: "Kenaz",
      oldNorse: "kaun",
      phonetic: "Ké-naz",
      translation: "Torche, feu intérieur",
      keywords: ["lumière", "conscience", "créativité", "révélation", "clarification"],
      purist:
        "Kenaz est la torche qui éclaire, la flamme de la connaissance et de la conscience. " +
        "Elle dissipe l’obscurité, met la lumière sur ce qui était caché, soutient la créativité et l’apprentissage.",
      psychology:
        "Psychologiquement, Kenaz représente la prise de conscience en cours : voir plus clair dans tes émotions, tes liens, tes choix. " +
        "Elle pointe aussi les domaines où tu refuses encore de regarder, par peur de ce que tu pourrais découvrir.",
      analyst:
        "Analyse Jarvis : Kenaz indique que la clé de la situation est dans l’éclairage d’un angle mort. " +
        "Une information, une lucidité ou une compréhension nouvelle peut transformer ta manière d’agir.",
      reversedHint:
        "Confusion, refus de voir, obscurcissement volontaire, maintien dans le flou.",
      shadow:
        "Utiliser sa lucidité pour juger et contrôler, plutôt que pour comprendre et transformer."
    },
    {
      key: "gebo",
      name: "Gebo",
      oldNorse: "gipt",
      phonetic: "Gui-bo",
      translation: "Don, alliance",
      keywords: ["don", "échange", "alliance", "équilibre", "réciprocité"],
      purist:
        "Gebo est la rune du don et de l’alliance, du contrat sacré entre deux parties. " +
        "Elle rappelle que tout don véritable crée un lien, et que l’équilibre entre donner et recevoir est nécessaire.",
      psychology:
        "Psychologiquement, Gebo met en lumière tes dynamiques de réciprocité : là où tu donnes trop, là où tu n’oses plus recevoir, " +
        "et là où tu restes dans des liens déséquilibrés par peur de perdre la relation.",
      analyst:
        "Analyse Jarvis : Gebo t’invite à auditer tes échanges (affectifs, professionnels, créatifs). " +
        "Là où l’alliance est claire et équilibrée, tu peux investir. Là où elle est floue ou à sens unique, un ajustement est nécessaire.",
      reversedHint:
        "Contrats flous, dons toxiques, dettes symboliques, liens où le prix à payer est trop élevé.",
      shadow:
        "Donner pour acheter l’amour, garder quelqu’un lié par des faveurs, se sacrifier pour éviter la solitude."
    },
    {
      key: "wunjo",
      name: "Wunjo",
      oldNorse: "vin",
      phonetic: "Woun-yo",
      translation: "Joie, harmonie",
      keywords: ["joie", "harmonie", "alignement", "soutien", "réussite"],
      purist:
        "Wunjo est la rune de la joie partagée, de l’harmonie retrouvée, du sentiment d’appartenir à quelque chose de vivant. " +
        "Elle marque les moments de réussite, de cohésion, de réconciliation.",
      psychology:
        "Psychologiquement, Wunjo montre où ton système aspire à plus de simplicité, de joie, de lien sain. " +
        "Elle révèle aussi parfois que tu as du mal à t’autoriser au plaisir ou à reconnaître ce qui va déjà bien.",
      analyst:
        "Analyse Jarvis : Wunjo signale un potentiel d’harmonisation de la situation, si tu acceptes de simplifier, de clarifier et de sortir du drame inutile. " +
        "Investir dans les liens nourrissants a ici un effet démultiplicateur.",
      reversedHint:
        "Joie fragile, dépendante, ou masquée ; peur de perdre un équilibre ; satisfaction superficielle.",
      shadow:
        "Faire semblant que tout va bien, lisser les conflits au lieu de les traiter, rester dans le confort même s’il étouffe."
    },
    {
      key: "hagalaz",
      name: "Hagalaz",
      oldNorse: "hagall",
      phonetic: "Ha-ga-laz",
      translation: "Grêle, chaos",
      keywords: ["rupture brutale", "crise", "destin", "réajustement forcé"],
      purist:
        "Hagalaz symbolise la grêle, le chaos soudain, les événements qui cassent une structure fragile. " +
        "C’est une force de destruction nécessaire quand quelque chose ne tient plus debout.",
      psychology:
        "Psychologiquement, Hagalaz correspond aux crises, aux moments où la vie semble « tomber en morceaux ». " +
        "Elle met en lumière les constructions intérieures ou extérieures qui ne sont plus viables, et qu’il est douloureux de laisser tomber.",
      analyst:
        "Analyse Jarvis : Hagalaz n’est pas là pour punir mais pour réaligner. " +
        "En identifiant ce qui casse, tu peux comprendre ce qui n’était plus juste, et reconstruire sur des bases plus solides.",
      reversedHint:
        "Résistance au changement, répétition de crises, refus de lire le message derrière le chaos.",
      shadow:
        "Se définir uniquement par les problèmes, vivre dans l’anticipation permanente du pire."
    },
    {
      key: "nauthiz",
      name: "Nauthiz",
      oldNorse: "nautr",
      phonetic: "Na-ou-ti-s",
      translation: "Nécessité, contrainte",
      keywords: ["manque", "frustration", "frein", "discipline", "besoin réel"],
      purist:
        "Nauthiz est la rune de la nécessité, des contraintes, des manques. " +
        "Elle parle des limitations qui obligent à se recentrer sur l’essentiel et sur le vrai besoin.",
      psychology:
        "Psychologiquement, Nauthiz renvoie à la frustration, au sentiment d’être freiné, coincé, limité. " +
        "Elle t’invite à distinguer ce que tu crois vouloir de ce dont tu as réellement besoin.",
      analyst:
        "Analyse Jarvis : Nauthiz suggère d’utiliser le frein comme un signal d’optimisation. " +
        "Ce que tu ne peux plus faire comme avant indique où ajuster ta stratégie, ton rythme, ou tes attentes.",
      reversedHint:
        "Autosabotage, victimisation, se coincer soi-même dans des contraintes auto-imposées.",
      shadow:
        "Garder des habitudes douloureuses parce qu’elles sont connues, refuser de poser les actes qui libèreraient."
    },
    {
      key: "isa",
      name: "Isa",
      oldNorse: "ís",
      phonetic: "I-sa",
      translation: "Glace, immobilité",
      keywords: ["pause", "immobilité", "congélation", "stabilité", "blocage apparent"],
      purist:
        "Isa est la glace, l’immobilité apparente qui fige les choses. " +
        "Elle peut stabiliser ce qui a besoin de se fixer, mais aussi figer ce qui aurait besoin de mouvement.",
      psychology:
        "Psychologiquement, Isa parle des phases d’arrêt, d’apathie, de figement émotionnel. " +
        "Elle peut signaler une protection temporaire ou une peur profonde de bouger.",
      analyst:
        "Analyse Jarvis : Isa invite à distinguer entre une pause régénératrice et un blocage. " +
        "Si le repos ne recharge plus, c’est que quelque chose doit fondre, être mis en mots ou en actes.",
      reversedHint:
        "Inertie prolongée, fuite en avant dans l’inaction, refus de tout changement.",
      shadow:
        "Se couper de ses émotions pour ne plus souffrir, devenir spectateur de sa propre vie."
    },
    {
      key: "jera",
      name: "Jera",
      oldNorse: "ár",
      phonetic: "Yé-ra",
      translation: "Récolte, cycle annuel",
      keywords: ["cycle", "récolte", "patience", "temps long", "résultat différé"],
      purist:
        "Jera est la rune de la récolte et des cycles. " +
        "Elle montre que chaque chose a une saison : semer, patienter, récolter, laisser la terre se reposer.",
      psychology:
        "Psychologiquement, Jera rappelle que certaines transformations ne se font pas en quelques jours. " +
        "Elle invite à honorer les petits pas, la constance, le temps long, plutôt que la gratification immédiate.",
      analyst:
        "Analyse Jarvis : Jera t’encourage à penser ton projet comme une culture : semis, entretien, récolte. " +
        "Ce que tu sèmes maintenant ne se verra clairement que dans plusieurs mois, voire années.",
      reversedHint:
        "Impatience, sentiment d’injustice face aux résultats, cycles qui se répètent faute d’apprentissage.",
      shadow:
        "Abandonner juste avant la récolte, croire que rien ne change parce que le changement est lent."
    },
    {
      key: "eihwaz",
      name: "Eihwaz",
      oldNorse: "eihwaz",
      phonetic: "Ei-vaz",
      translation: "If, axe de monde",
      keywords: ["profondeur", "résilience", "transition", "protection profonde"],
      purist:
        "Eihwaz est liée à l’if, arbre des cimetières, symbole de mort et de continuité, et à l’axe entre mondes. " +
        "Elle parle des transitions profondes, des passages difficiles qui renforcent.",
      psychology:
        "Psychologiquement, Eihwaz évoque les périodes où tu traverses des zones d’ombre, des deuils, des fins nécessaires. " +
        "Elle rappelle que certaines forces ne se révèlent que dans l’épreuve.",
      analyst:
        "Analyse Jarvis : Eihwaz indique qu’il est temps de structurer ton rapport aux crises : ce que tu apprends, ce que tu laisses mourir, " +
        "ce que tu choisis de porter avec dignité plutôt que de subir.",
      reversedHint:
        "Blocage dans le passé, refus de traverser une transition, rester entre deux mondes sans choisir.",
      shadow:
        "S’identifier à la souffrance au point de refuser de guérir, confondre profondeur et lourdeur permanente."
    },
    {
      key: "perthro",
      name: "Perthro",
      oldNorse: "perþ",
      phonetic: "Per-thro",
      translation: "Coupelle, destin caché, tirage",
      keywords: ["mystère", "destin", "jeu", "révélation", "aléatoire"],
      purist:
        "Perthro est la rune du gobelet à dés, du destin caché, de ce qui se révèle par le tirage, l’intuition, le hasard sacré. " +
        "Elle évoque la part de mystère, de synchronicité, de jeu dans la vie.",
      psychology:
        "Psychologiquement, Perthro explore ton rapport au contrôle et au lâcher-prise. " +
        "Elle parle de ta capacité à accepter que tu ne maîtrises pas tout, et que certaines informations surgissent au bon moment.",
      analyst:
        "Analyse Jarvis : Perthro t’encourage à observer les coïncidences, les signaux faibles, les retours d’expérience. " +
        "En intégrant cette part de “jeu” dans ta stratégie, tu peux ajuster au lieu de vouloir tout prévoir.",
      reversedHint:
        "Refus de voir les signes, dépendance à la chance, sensation d’être spectateur de sa vie.",
      shadow:
        "Se cacher derrière le destin pour ne pas agir, ou au contraire tout réduire à du hasard sans sens."
    },
    {
      key: "algiz",
      name: "Algiz",
      oldNorse: "elhaz",
      phonetic: "Al-giz",
      translation: "Élan, protection",
      keywords: ["protection", "intuition", "alerte", "limites", "connexion"],
      purist:
        "Algiz est la rune de la protection active, souvent liée à l’élan ou au cygne, bras levés vers le ciel. " +
        "Elle symbolise l’antenne, l’alerte intuitive, le bouclier énergétique.",
      psychology:
        "Psychologiquement, Algiz renvoie à ton système d’alerte : instincts, sensations, signaux que ton corps t’envoie. " +
        "Elle t’invite à respecter ces signaux plutôt qu’à les étouffer.",
      analyst:
        "Analyse Jarvis : Algiz indique que la priorité est la mise en sécurité de ton système (limites, environnement, rythme). " +
        "Un cadre plus protecteur augmente ta capacité d’agir efficacement.",
      reversedHint:
        "Signaux ignorés, frontières poreuses, exposition à des influences qui te fragilisent.",
      shadow:
        "Se couper de tout par peur, vivre uniquement en mode défense, refuser toute vulnérabilité."
    },
    {
      key: "sowilo",
      name: "Sowilo",
      oldNorse: "sól",
      phonetic: "So-wi-lo",
      translation: "Soleil, victoire",
      keywords: ["lumière", "réussite", "cohérence", "vitalité", "direction"],
      purist:
        "Sowilo est la rune du Soleil, de la clarté, de la réussite alignée. " +
        "Elle symbolise la lumière qui traverse, la victoire qui vient de l’intérieur plus que du résultat extérieur.",
      psychology:
        "Psychologiquement, Sowilo évoque la confiance fondamentale en ta capacité à trouver un chemin. " +
        "Elle met en lumière tes zones de cohérence, là où tu te sens à ta place.",
      analyst:
        "Analyse Jarvis : Sowilo suggère qu’un alignement net est possible si tu assumes ce qui te rend vivant, même si cela bouscule certains rôles. " +
        "Clarifier ton “soleil intérieur” t’aide à prioriser.",
      reversedHint:
        "Burn-out, dispersion, succès apparent mais vide, perte de sens.",
      shadow:
        "Chercher la lumière extérieure au point d’oublier ta propre source, sacrifier tout pour l’image de réussite."
    },
    {
      key: "tiwaz",
      name: "Tiwaz",
      oldNorse: "týr",
      phonetic: "Ti-vaz",
      translation: "Týr, justice, engagement",
      keywords: ["justice", "honneur", "combat juste", "stratégie", "engagement"],
      purist:
        "Tiwaz est la rune du dieu Týr, associé à la justice, au courage, au sacrifice consenti pour le bien commun. " +
        "Elle marque les combats justes, les engagements honorables.",
      psychology:
        "Psychologiquement, Tiwaz parle de ton sens de la loyauté, de l’éthique, de ta manière de te battre pour ce qui compte. " +
        "Elle questionne aussi tes combats inutiles, où tu t’épuises pour des causes qui ne sont plus les tiennes.",
      analyst:
        "Analyse Jarvis : Tiwaz t’invite à recadrer tes batailles : où ton énergie est-elle vraiment utile ? " +
        "Aligner tes choix sur ton code d’honneur réel te donne une force tranquille.",
      reversedHint:
        "Combat mal orienté, injustice vécue, agressivité ou rigidité morale.",
      shadow:
        "Se sacrifier dans des guerres qui ne sont pas les tiennes, ou imposer ta justice comme seule vérité."
    },
    {
      key: "berkano",
      name: "Berkano",
      oldNorse: "bjarkan",
      phonetic: "Ber-ka-no",
      translation: "Bouleau, naissance, croissance",
      keywords: ["naissance", "croissance", "soin", "féminin", "maternage"],
      purist:
        "Berkano est liée au bouleau, à la naissance, au soin, au principe maternel. " +
        "Elle parle d’émergence, de gestation, de protection des débuts fragiles.",
      psychology:
        "Psychologiquement, Berkano évoque la manière dont tu te prends (ou pas) en douceur, la place que tu laisses à la vulnérabilité. " +
        "Elle peut signaler un besoin de reparentage symbolique, de douceur envers toi-même.",
      analyst:
        "Analyse Jarvis : Berkano t’invite à considérer ce que tu es en train de faire naître : projet, relation, version de toi. " +
        "Cela demande une stratégie de soin, de mise en sécurité, plutôt qu’un forcing.",
      reversedHint:
        "Difficulté à prendre soin, épuisement maternel/paternel, rejet de sa propre vulnérabilité.",
      shadow:
        "Se sacrifier complètement pour les autres au point de s’oublier, étouffer ce que l’on protège."
    },
    {
      key: "ehwaz",
      name: "Ehwaz",
      oldNorse: "ehwaz",
      phonetic: "É-vaz",
      translation: "Cheval, coopération",
      keywords: ["mouvement", "coopération", "confiance", "progression", "alliés"],
      purist:
        "Ehwaz est le cheval, le lien entre cavalier et monture, symbole de coopération, de confiance, de progression en duo. " +
        "Elle parle de déplacement, d’alliance, de synergie.",
      psychology:
        "Psychologiquement, Ehwaz met en lumière la qualité de tes collaborations : là où tu peux t’appuyer, là où tu portes tout seul, " +
        "et la manière dont tu travailles avec ton propre corps comme allié.",
      analyst:
        "Analyse Jarvis : Ehwaz suggère que tu gagneras à ne plus avancer seul. " +
        "Identifier les bonnes alliances, humaines ou symboliques, peut accélérer un processus sans t’épuiser.",
      reversedHint:
        "Rupture de coopération, méfiance, difficulté à se laisser aider.",
      shadow:
        "Porter tout sur tes épaules pour garder le contrôle, refuser de déléguer ou de t’ouvrir à un soutien."
    },
    {
      key: "mannaz",
      name: "Mannaz",
      oldNorse: "maðr",
      phonetic: "Ma-nnaz",
      translation: "Humain, soi et les autres",
      keywords: ["identité", "humanité", "relation", "collectif", "image de soi"],
      purist:
        "Mannaz représente l’humain, la personne dans le collectif, l’équilibre entre l’individu et le groupe. " +
        "Elle parle de ta place parmi les autres, de ton humanité partagée.",
      psychology:
        "Psychologiquement, Mannaz interroge ton identité : comment tu te perçois, ce que tu crois devoir être pour les autres, " +
        "et la façon dont tu supportes d’être simplement humain, avec tes limites.",
      analyst:
        "Analyse Jarvis : Mannaz t’invite à revisiter tes rôles sociaux : famille, travail, communauté. " +
        "Là où tu joues un rôle figé, il y a de la fatigue ; là où tu peux être authentique, il y a du souffle.",
      reversedHint:
        "Isolement, masque social, difficulté à se montrer tel que l’on est.",
      shadow:
        "Se perdre dans les attentes des autres, ou se couper totalement de tout lien pour ne plus souffrir."
    },
    {
      key: "laguz",
      name: "Laguz",
      oldNorse: "lögr",
      phonetic: "La-gouz",
      translation: "Eau, flux émotionnel",
      keywords: ["intuition", "émotion", "rêve", "expansion", "inconscient"],
      purist:
        "Laguz est la rune de l’eau, des flux émotionnels, du rêve, de l’inconscient. " +
        "Elle symbolise les marées intérieures, la capacité à suivre le courant juste.",
      psychology:
        "Psychologiquement, Laguz met en valeur ton monde émotionnel et intuitif. " +
        "Elle souligne là où tu te laisses porter par ton ressenti, et là où tu t’y noies ou le coupes.",
      analyst:
        "Analyse Jarvis : Laguz suggère d’inclure davantage ta sensibilité et ton intuition dans ta stratégie. " +
        "Les signaux non rationnels peuvent t’aider à ajuster le cap plutôt qu’à tout décider avec la tête.",
      reversedHint:
        "Confusion, débordement émotionnel, fuite dans les rêveries, addiction aux intensités.",
      shadow:
        "Se dissoudre dans les émotions des autres, perdre toute structure en voulant tout ressentir."
    },
    {
      key: "ingwaz",
      name: "Ingwaz",
      oldNorse: "ing",
      phonetic: "Ing-ouaz",
      translation: "Ingw, gestation, potentiel",
      keywords: ["potentiel", "intérieur", "rassemblement", "maturation", "préparation"],
      purist:
        "Ingwaz est la rune de la gestation, du potentiel rassemblé, des choses qui mûrissent à l’abri avant de se manifester. " +
        "Elle parle de concentration d’énergie en vue d’un futur déploiement.",
      psychology:
        "Psychologiquement, Ingwaz évoque les phases où tu accumules de l’expérience, des idées, des forces sans que cela soit encore visible. " +
        "Elle t’invite à faire confiance à ce travail souterrain.",
      analyst:
        "Analyse Jarvis : Ingwaz t’indique qu’une étape importante se joue en coulisses. " +
        "Structurer ton espace, ton temps, tes priorités permet à ce potentiel de se manifester au bon moment.",
      reversedHint:
        "Rester en gestation éternelle, ne jamais lancer, bloquer la sortie de ce qui est prêt.",
      shadow:
        "Attendre que tout soit parfait pour agir, accumuler connaissances et préparations sans passage à l’acte."
    },
    {
      key: "dagaz",
      name: "Dagaz",
      oldNorse: "dagr",
      phonetic: "Da-gaz",
      translation: "Jour, bascule",
      keywords: ["bascule", "illumination", "changement de phase", "veille/jour"],
      purist:
        "Dagaz est la rune de l’aube, du passage de la nuit au jour. " +
        "Elle symbolise la bascule de conscience, les moments où une situation change de qualité.",
      psychology:
        "Psychologiquement, Dagaz parle des prises de conscience qui transforment ta perception. " +
        "Elle signale souvent un avant/après, une sortie de tunnel ou un changement de paradigme.",
      analyst:
        "Analyse Jarvis : Dagaz t’invite à accompagner activement une transition en cours. " +
        "Affiner tes choix et tes engagements maintenant peut orienter durablement la prochaine phase.",
      reversedHint:
        "Refus de voir que le cycle change, rester accroché à l’ancien mode de vie.",
      shadow:
        "Saboter les périodes de clarté en retournant volontairement dans le flou ou l’ancien chaos."
    },
    {
      key: "othala",
      name: "Othala",
      oldNorse: "óðal",
      phonetic: "O-tha-la",
      translation: "Héritage, foyer, territoire",
      keywords: ["héritage", "racines", "famille", "territoire", "transmission"],
      purist:
        "Othala est la rune de l’héritage : terres, maison, lignée, patrimoine matériel et immatériel. " +
        "Elle parle de ce que tu reçois et de ce que tu transmets.",
      psychology:
        "Psychologiquement, Othala questionne tes racines : tes loyautés familiales, les schémas transmis, " +
        "les croyances héritées qui gouvernent encore tes choix.",
      analyst:
        "Analyse Jarvis : Othala t’invite à distinguer ce que tu choisis de garder de ton héritage, et ce que tu peux laisser. " +
        "Tu peux honorer ta lignée sans reproduire ce qui ne te correspond plus.",
      reversedHint:
        "Conflits liés à la famille, à l’héritage, au territoire ; difficulté à se sentir « chez soi ». ",
      shadow:
        "Rester enfermé dans les histoires de la famille, se définir seulement par d’où l’on vient."
    }
  ];

  /* -------- 2. Position des runes dans le tirage -------- */

  function runePositionLabel(count, index) {
    if (count === 1) return "Message du moment";

    if (count === 3) {
      return ["Passé", "Présent", "Futur"][index] || `Position ${index + 1}`;
    }
    if (count === 5) {
      const labels = [
        "Fondation",
        "Défi",
        "Essence de la situation",
        "Conseil",
        "Issue probable"
      ];
      return labels[index] || `Position ${index + 1}`;
    }
    if (count === 9) {
      const labels = [
        "Situation actuelle",
        "Défi principal",
        "Ressources visibles",
        "Ressources cachées",
        "Ce qui doit être lâché",
        "Ce qui doit être renforcé",
        "Direction profonde",
        "Potentiel à moyen terme",
        "Synthèse du chemin"
      ];
      return labels[index] || `Position ${index + 1}`;
    }
    return `Position ${index + 1}`;
  }

  /* -------- 3. Tirage aléatoire -------- */

  function drawRunes(count, seedSource) {
    const seed = createSeed(seedSource || Date.now().toString());
    const rand = mulberry32(seed);
    const indices = [];

    while (indices.length < count && indices.length < ELDER_FUTHARK.length) {
      const i = Math.floor(rand() * ELDER_FUTHARK.length);
      if (!indices.includes(i)) indices.push(i);
    }

    return indices.map(i => {
      const base = ELDER_FUTHARK[i];
      const reversed = rand() < 0.5;
      return { ...base, reversed };
    });
  }

  /* -------- 4. Axe runique personnel (Lifetime, 9 runes) -------- */

  function computeRuneAxis(runes) {
    const themes = {
      corps_et_vitalite: ["uruz", "eihwaz", "isa"],
      richesse_et_flux: ["fehu", "jera", "hagalaz"],
      communication_et_vision: ["ansuz", "kenaz", "sowilo"],
      relations_et_alliances: ["gebo", "wunjo", "mannaz", "ehwaz"],
      protection_et_limites: ["thurisaz", "algiz", "nauthiz"],
      mystere_et_intuition: ["perthro", "laguz", "dagaz", "ingwaz"],
      racines_et_heritage: ["tiwaz", "berkano", "othala", "raidho"]
    };

    const counts = {};
    Object.keys(themes).forEach(k => (counts[k] = 0));

    for (const r of runes) {
      for (const [k, list] of Object.entries(themes)) {
        if (list.includes(r.key)) counts[k]++;
      }
    }

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const mainAxis = sorted[0];
    const secondAxis = sorted[1];

    function labelAxis(k) {
      switch (k) {
        case "corps_et_vitalite":
          return "Corps & Vitalité";
        case "richesse_et_flux":
          return "Richesse & Flux de vie";
        case "communication_et_vision":
          return "Communication & Vision";
        case "relations_et_alliances":
          return "Relations & Alliances";
        case "protection_et_limites":
          return "Protection & Limites";
        case "mystere_et_intuition":
          return "Mystère & Intuition";
        case "racines_et_heritage":
          return "Racines & Héritage";
        default:
          return k;
      }
    }

    let txt = "";

    if (mainAxis && mainAxis[1] > 0) {
      txt += `<p><strong>Axe principal :</strong> ${labelAxis(mainAxis[0])}</p>`;
      txt += `<p>Ce tirage montre que ton chemin actuel se concentre surtout sur ce domaine : ` +
        `comment tu l’habites, le protèges et le fais évoluer en conscience.</p>`;
    }

    if (secondAxis && secondAxis[1] > 0) {
      txt += `<p><strong>Axe secondaire :</strong> ${labelAxis(secondAxis[0])}</p>`;
      txt += `<p>Il agit comme un contrepoids ou un soutien à ton axe principal : un terrain où tu peux venir ` +
        `reprendre appui pour rééquilibrer ton parcours.</p>`;
    }

    if (!txt) {
      txt =
        `<p>Aucun axe dominant ne ressort clairement. Ta dynamique actuelle semble répartie sur plusieurs terrains, ` +
        `sans suraccent fort : c’est une phase d’équilibrage global plutôt que de focalisation unique.</p>`;
    }

    txt += `<p class="subnote">
      Cet axe runique personnel est une carte symbolique. Il ne fixe pas ton destin, mais propose un fil rouge à observer dans les mois à venir.
    </p>`;

    return txt;
  }

  /* -------- 5. Rendu HTML de la lecture -------- */

  function renderRunesReading(root, runes, count) {
    const out = hs$("#runes-output", root);
    if (!out) return;

    const lvl = getAccessLevel();
    const premium = isPremium();
    const lifetime = isLifetime();

    let html = "";
    html += `<p class="subnote">
      Tirage : <strong>${count} rune(s)</strong> — Niveau : <strong>${lvl.toUpperCase()}</strong>
    </p>`;

    runes.forEach((r, idx) => {
      const posLabel = runePositionLabel(count, idx);
      const title = r.name + (r.reversed ? " (renversée)" : "");

      html += `<hr>`;
      html += `<h3>${posLabel} : ${title}</h3>`;
      html += `<p><strong>Nom ancien :</strong> ${r.oldNorse} — <strong>Prononciation :</strong> ${r.phonetic}</p>`;
      html += `<p><strong>Traduction littérale :</strong> ${r.translation}</p>`;
      html += `<p><strong>Mots-clés :</strong> ${r.keywords.join(", ")}</p>`;

      html += `<h4>Tradition puriste</h4>`;
      html += `<p>${r.purist}</p>`;
      if (r.reversed && r.reversedHint) {
        html += `<p><em>Renversée :</em> ${r.reversedHint}</p>`;
      }

      if (premium) {
        html += `<h4>Lecture psychologique</h4>`;
        html += `<p>${r.psychology}</p>`;

        html += `<h4>Analyse Jarvis (stratégique)</h4>`;
        html += `<p>${r.analyst}</p>`;

        if (r.shadow) {
          html += `<p class="subnote"><strong>Zone d’ombre possible :</strong> ${r.shadow}</p>`;
        }
      } else {
        html += `<p><strong>Synthèse :</strong> ${r.psychology}</p>`;
      }
    });

    if (lifetime && count === 9) {
      html += `<hr><h3>Axe runique personnel (Lifetime)</h3>`;
      html += computeRuneAxis(runes);
    }

    html += `<hr><p class="subnote">
      Les runes sont un outil symbolique. Elles n’annoncent pas un destin figé : elles éclairent des dynamiques possibles.
      Elles ne remplacent ni un avis médical, ni un accompagnement psychologique ou thérapeutique.
    </p>`;

    out.innerHTML = html;
  }

  /* -------- 6. Garde-fou d’accès -------- */

  function guardAccess(root, count) {
    const premium = isPremium();
    const out = hs$("#runes-output", root);
    if (!out) return false;

    if (!premium && count > 3) {
      out.innerHTML = `
        <p><strong>Accès limité.</strong></p>
        <p>Le tirage à <strong>${count} runes</strong> est réservé aux niveaux
        <strong>ABONNEMENT</strong> ou <strong>ACCÈS À VIE</strong>.</p>
        <p class="subnote">
          Tu peux déjà utiliser les tirages 1 et 3 runes en mode FREE pour une première guidance.
          Passe en mode Premium dans l’onglet <em>Premium</em> pour débloquer les tirages étendus.
        </p>
      `;
      return false;
    }
    return true;
  }

  /* -------- 7. Tirage principal -------- */

  function runesDoDraw(root, count) {
    if (!guardAccess(root, count)) return;

    const qInput = hs$("#runes-question", root);
    const question = qInput ? qInput.value.trim() : "";

    const firstname = (document.getElementById("a-firstname") || {}).value || "";
    const date = (document.getElementById("a-date") || {}).value || "";
    const place = (document.getElementById("a-place") || {}).value || "";

    const today = new Date().toISOString().slice(0, 10);

    const seedSource = `${firstname}|${date}|${place}|${question}|${count}|${today}`;
    const runes = drawRunes(count, seedSource);
    renderRunesReading(root, runes, count);
  }

  /* -------- 8. Texte d’aide accès -------- */

  function updateRunesAccessHint(root) {
    const hint = hs$("#runes-access-hint", root);
    if (!hint) return;
    const lvl = getAccessLevel();

    if (lvl === "free") {
      hint.innerHTML =
        'Niveau actuel : <strong>FREE</strong> — tirages 1 & 3 runes disponibles. ' +
        'Les tirages 5 & 9 runes sont réservés au Premium.';
    } else if (lvl === "sub") {
      hint.innerHTML =
        'Niveau actuel : <strong>ABONNEMENT</strong> — tirages 1 / 3 / 5 / 9 runes ' +
        'avec triple interprétation puriste + psycho + Jarvis.';
    } else {
      hint.innerHTML =
        'Niveau actuel : <strong>ACCÈS À VIE</strong> — tirages 1 / 3 / 5 / 9 runes complets ' +
        ' + axe runique personnel sur les 9 runes.';
    }
  }

  /* -------- 9. Fonction d’init publique -------- */

  function HS_runes_init(container) {
    const root = container || document;

    const b1 = hs$("#btn-runes-1", root);
    const b3 = hs$("#btn-runes-3", root);
    const b5 = hs$("#btn-runes-5", root);
    const b9 = hs$("#btn-runes-9", root);

    if (b1) b1.addEventListener("click", () => runesDoDraw(root, 1));
    if (b3) b3.addEventListener("click", () => runesDoDraw(root, 3));
    if (b5) b5.addEventListener("click", () => runesDoDraw(root, 5));
    if (b9) b9.addEventListener("click", () => runesDoDraw(root, 9));

    const qInput = hs$("#runes-question", root);
    if (qInput) {
      qInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          runesDoDraw(root, 1);
        }
      });
    }

    updateRunesAccessHint(root);
  }

  window.HS_runes_init = HS_runes_init;
})();
