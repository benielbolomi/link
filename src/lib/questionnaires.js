function mkQ(id, type, label, opts = {}) {
  return {
    id,
    type,
    label,
    required: opts.required ?? true,
    options: opts.options,
    placeholder: opts.placeholder,
    maxLength: opts.maxLength,
    condition: opts.condition,
    allowOther: opts.allowOther,
    multi: opts.multi,
  }
}

export const questionnaires = {
  entreprise: {
    profile: 'entreprise',
    title: 'Questionnaire Entreprises & Sponsors',
    description:
      "Ce questionnaire nous aide à comprendre les habitudes de sponsoring de votre entreprise, vos objectifs et ce qui influencerait vos décisions d'investissement.",
    estimatedMinutes: 5,
    sections: [
      {
        id: 'section-1',
        title: 'Budget et habitudes de sponsoring',
        questions: [
          mkQ('a1', 'radio', "Votre entreprise a-t-elle déjà financé un club, un événement, un créateur de contenu ou une autre initiative en échange de visibilité ?", {
            options: [
              { value: 'oui', label: 'Oui' },
              { value: 'non', label: 'Non' },
            ],
          }),
          mkQ('a2', 'radio', "Si oui, combien avez-vous investi au cours des 12 derniers mois ?", {
            condition: { questionId: 'a1', value: 'oui' },
            required: false,
            options: [
              { value: 'aucune', label: 'Aucune dépense de sponsoring' },
              { value: 'moins-100', label: 'Moins de 100 USD' },
              { value: '100-499', label: 'De 100 à 499 USD' },
              { value: '500-999', label: 'De 500 à 999 USD' },
              { value: '1000-4999', label: 'De 1 000 à 4 999 USD' },
              { value: '5000-plus', label: '5 000 USD ou plus' },
              { value: 'na', label: 'Je préfère ne pas répondre' },
            ],
          }),
          mkQ('a3', 'checkbox', "Si votre entreprise n'a jamais investi dans le sponsoring, qu'est-ce qui l'en a principalement empêchée ?", {
            condition: { questionId: 'a1', value: 'non' },
            required: false,
            multi: true,
            options: [
              { value: 'budget', label: 'Manque de budget' },
              { value: 'opportunites', label: "Manque d'opportunités adaptées" },
              { value: 'confiance', label: 'Manque de confiance' },
              { value: 'mesure', label: 'Difficulté à mesurer les résultats' },
            ],
            allowOther: true,
          }),
          mkQ('a4', 'radio', 'Quel est votre objectif prioritaire ?', {
            options: [
              { value: 'notoriete', label: 'Accroître la notoriété' },
              { value: 'ventes', label: 'Augmenter les ventes' },
              { value: 'nouveaux-clients', label: 'Attirer de nouveaux clients' },
              { value: 'image', label: "Améliorer l'image de marque" },
              { value: 'engagement', label: "Accroître l'engagement communautaire" },
              { value: 'cause', label: 'Soutenir une cause ou une initiative sociale' },
            ],
          }),
        ],
      },
      {
        id: 'section-2',
        title: 'Choix et mesure de la visibilité',
        questions: [
          mkQ('a5', 'checkbox', "Quels éléments vous feraient préférer un club sportif, un influenceur ou un événement à un autre ?", {
            multi: true,
            options: [
              { value: 'audience', label: 'Audience' },
              { value: 'reputation', label: 'Réputation' },
              { value: 'pertinence', label: 'Pertinence avec la marque' },
              { value: 'localisation', label: 'Localisation' },
              { value: 'engagement', label: 'Engagement' },
              { value: 'cout', label: 'Coût' },
              { value: 'qualite', label: "Qualité de l'offre" },
            ],
            allowOther: true,
          }),
          mkQ('a6', 'checkbox', 'Quelles preuves exigeriez-vous avant de financer un partenariat ?', {
            multi: true,
            options: [
              { value: 'stats-audience', label: "Statistiques d'audience" },
              { value: 'reputation', label: 'Réputation' },
              { value: 'calendrier', label: "Calendrier d'exposition" },
              { value: 'references', label: 'Références' },
              { value: 'resultats', label: 'Résultats antérieurs' },
            ],
            allowOther: true,
          }),
          mkQ('a6b', 'textarea', 'Précisions éventuelles sur les preuves exigées (facultatif)', {
            required: false,
            maxLength: 500,
            placeholder: 'Ajoutez toute précision utile (500 caractères maximum)...',
          }),
          mkQ('a7', 'radio', 'Quel montant seriez-vous prêt à investir pour une offre concrète précisant les supports, la durée et les livrables ?', {
            options: [
              { value: 'moins-100', label: 'Moins de 100 USD' },
              { value: '100-499', label: 'De 100 à 499 USD' },
              { value: '500-999', label: 'De 500 à 999 USD' },
              { value: '1000-4999', label: 'De 1 000 à 4 999 USD' },
              { value: '5000-plus', label: '5 000 USD ou plus' },
              { value: 'depend', label: "Cela dépend de l'offre" },
            ],
          }),
          mkQ('a8', 'textarea', "Qu'est-ce qui vous ferait refuser immédiatement un partenariat, même si l'audience est importante ?", {
            placeholder: 'Expliquez les éléments qui vous feraient refuser un partenariat...',
          }),
        ],
      },
    ],
  },

  beneficiaire: {
    profile: 'beneficiaire',
    title: 'Questionnaire Clubs, Athlètes & Créateurs de contenu',
    description:
      "Ce questionnaire nous aide à comprendre ce que vous pouvez réellement proposer à un sponsor, votre audience et votre capacité à exécuter les prestations promises.",
    estimatedMinutes: 6,
    sections: [
      {
        id: 'section-1',
        title: 'Votre profil et votre audience',
        questions: [
          mkQ('b1', 'radio', 'Quel est votre profil ?', {
            options: [
              { value: 'club', label: 'Club sportif' },
              { value: 'athlete', label: 'Athlète' },
              { value: 'createur', label: 'Créateur de contenu' },
              { value: 'autre', label: 'Autre' },
            ],
          }),
          mkQ('b2', 'textarea', "Quelle audience atteignez-vous et sur quels supports ?", {
            placeholder: "Décrivez votre audience (taille, démographie, supports utilisés: réseaux sociaux, TV, stade, etc.)...",
          }),
          mkQ('b3', 'radio', 'À quelle fréquence publiez-vous du contenu ou organisez-vous des événements ?', {
            options: [
              { value: 'quotidien', label: 'Quotidiennement' },
              { value: 'hebdomadaire', label: 'Hebdomadairement' },
              { value: 'mensuel', label: 'Mensuellement' },
              { value: 'occasionnel', label: 'Occasionnellement' },
            ],
          }),
          mkQ('b4', 'textarea', 'Quelles statistiques pouvez-vous fournir et vérifier ?', {
            placeholder: "Indiquez les statistiques disponibles (vues, abonnés, taux d'engagement, fréquentation, etc.)...",
          }),
        ],
      },
      {
        id: 'section-2',
        title: "Partenariats et capacité d'exécution",
        questions: [
          mkQ('b5', 'checkbox', 'Quels types de partenariats accepteriez-vous ?', {
            multi: true,
            options: [
              { value: 'maillot', label: 'Sponsoring de maillot / équipement' },
              { value: 'reseaux', label: 'Publications sur réseaux sociaux' },
              { value: 'evenement', label: "Sponsoring d'événement" },
              { value: 'ambassadeur', label: "Rôle d'ambassadeur de marque" },
              { value: 'contenu', label: 'Création de contenu dédié' },
              { value: 'affichage', label: 'Affichage / panneaux publicitaires' },
            ],
            allowOther: true,
          }),
          mkQ('b6', 'textarea', "Quels produits, secteurs ou valeurs refuseriez-vous d'associer à votre image ?", {
            placeholder: 'Listez les produits, secteurs ou valeurs que vous refuseriez...',
          }),
          mkQ('b7', 'textarea', 'Quel prix demanderiez-vous pour des prestations publicitaires précises ?', {
            placeholder: 'Indiquez vos tarifs pour des prestations types (publication, événement, saison, etc.)...',
          }),
          mkQ('b8', 'radio', 'Pouvez-vous fournir des preuves des résultats obtenus après une campagne de sponsoring ?', {
            options: [
              { value: 'oui-complets', label: 'Oui, des preuves complètes' },
              { value: 'oui-partiels', label: 'Oui, des preuves partielles' },
              { value: 'non', label: 'Non, pas encore' },
            ],
          }),
          mkQ('b9', 'radio', 'Avez-vous déjà travaillé avec un sponsor ?', {
            options: [
              { value: 'oui', label: 'Oui' },
              { value: 'non', label: 'Non' },
            ],
          }),
          mkQ('b9b', 'textarea', "Si oui, qu'est-ce qui a fonctionné ou échoué ?", {
            condition: { questionId: 'b9', value: 'oui' },
            required: false,
            placeholder: "Décrivez ce qui a bien fonctionné et ce qui a posé problème...",
          }),
          mkQ('b10', 'radio', "Disposez-vous des équipements, des personnes et des moyens nécessaires pour respecter les engagements publicitaires d'un contrat ?", {
            condition: { questionId: 'b1', value: 'club' },
            required: false,
            options: [
              { value: 'oui-complet', label: 'Oui, entièrement' },
              { value: 'partiel', label: 'Partiellement' },
              { value: 'non', label: 'Non, des manques importants' },
            ],
          }),
        ],
      },
    ],
  },

  public: {
    profile: 'public',
    title: 'Questionnaire Grand public',
    description:
      "Ce questionnaire court nous aide à comprendre la perception du sponsoring par le public et son influence sur la confiance envers les marques.",
    estimatedMinutes: 3,
    sections: [
      {
        id: 'section-1',
        title: 'Vos habitudes de suivi',
        questions: [
          mkQ('c1', 'checkbox', 'Suivez-vous régulièrement des clubs, athlètes, événements ou créateurs de contenu ?', {
            multi: true,
            options: [
              { value: 'clubs', label: 'Clubs sportifs' },
              { value: 'athletes', label: 'Athlètes' },
              { value: 'evenements', label: 'Événements' },
              { value: 'createurs', label: 'Créateurs de contenu' },
              { value: 'aucun', label: 'Aucun en particulier' },
            ],
          }),
          mkQ('c2', 'checkbox', 'Sur quelles plateformes découvrez-vous les sponsors ?', {
            multi: true,
            options: [
              { value: 'tv', label: 'Télévision' },
              { value: 'reseaux', label: 'Réseaux sociaux' },
              { value: 'stade', label: "Stade / lieu d'événement" },
              { value: 'presse', label: 'Presse / médias en ligne' },
              { value: 'bouche-oreille', label: 'Bouche-à-oreille' },
            ],
            allowOther: true,
          }),
        ],
      },
      {
        id: 'section-2',
        title: 'Perception et influence',
        questions: [
          mkQ('c3', 'radio', 'Comment percevez-vous les marques qui financent des activités sportives, culturelles ou numériques ?', {
            options: [
              { value: 'tres-positive', label: 'Très positivement' },
              { value: 'positive', label: 'Plutôt positivement' },
              { value: 'neutre', label: 'Neutre' },
              { value: 'negative', label: 'Plutôt négativement' },
              { value: 'tres-negative', label: 'Très négativement' },
            ],
          }),
          mkQ('c4', 'radio', 'Le sponsoring influence-t-il votre confiance envers une marque ?', {
            options: [
              { value: 'oui-beaucoup', label: 'Oui, beaucoup' },
              { value: 'oui-un-peu', label: 'Oui, un peu' },
              { value: 'non', label: 'Non, pas vraiment' },
              { value: 'ne-sais-pas', label: 'Je ne sais pas' },
            ],
          }),
          mkQ('c5', 'radio', "Le sponsoring a-t-il déjà influencé une de vos décisions d'achat ?", {
            options: [
              { value: 'oui', label: 'Oui' },
              { value: 'non', label: 'Non' },
              { value: 'pas-sur', label: 'Je ne suis pas sûr' },
            ],
          }),
          mkQ('c6', 'checkbox', 'Quels types de partenariats trouvez-vous les plus pertinents ?', {
            multi: true,
            options: [
              { value: 'sport-local', label: 'Sport local / communautaire' },
              { value: 'sport-pro', label: 'Sport professionnel' },
              { value: 'culture', label: 'Culture / arts' },
              { value: 'social', label: 'Causes sociales' },
              { value: 'createurs', label: 'Créateurs de contenu' },
              { value: 'education', label: 'Éducation / jeunesse' },
            ],
            allowOther: true,
          }),
          mkQ('c7', 'textarea', "Qu'est-ce qui rend un partenariat crédible à vos yeux ? (facultatif)", {
            required: false,
            placeholder: 'Décrivez ce qui rend un partenariat crédible...',
          }),
          mkQ('c8', 'textarea', "À l'inverse, qu'est-ce qui rend un partenariat peu convaincant ? (facultatif)", {
            required: false,
            placeholder: 'Décrivez ce qui vous rend sceptique face à un partenariat...',
          }),
        ],
      },
    ],
  },
}

export const getQuestionnaire = (profile) => questionnaires[profile]

export const profileLabels = {
  entreprise: 'Entreprise ou sponsor potentiel',
  beneficiaire: 'Club sportif, athlète ou créateur de contenu',
  public: 'Grand public',
}
