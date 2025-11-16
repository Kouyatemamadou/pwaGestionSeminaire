// Données mockées pour tester sans backend
export const MOCK_USERS = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123', // En production, ne jamais stocker en clair !
    role: 'commission_administration',
    email: 'admin@test.com'
  },
  {
    id: '2',
    username: 'user',
    password: 'user123',
    role: 'utilisateur',
    email: 'user@test.com'
  }
];

export const MOCK_SEMINARISTES = [
  {
    id: 'sem001',
    nom: 'Diallo',
    prenom: 'Mamadou',
    date_naissance: '2000-01-15',
    lieu_naissance: 'Conakry',
    telephone: '+224 621 234 567',
    email: 'mamadou.diallo@example.com',
    adresse: 'Quartier Madina, Conakry',
    niveau_etude: 'Bac+2',
    classe: 'Niveau 2',
    statut: 'actif',
    photo: null
  },
  {
    id: 'sem002',
    nom: 'Bah',
    prenom: 'Abdoulaye',
    date_naissance: '1999-05-20',
    lieu_naissance: 'Labé',
    telephone: '+224 622 345 678',
    email: 'abdoulaye.bah@example.com',
    adresse: 'Quartier Hamdallaye, Conakry',
    niveau_etude: 'Bac+3',
    classe: 'Niveau 3',
    statut: 'actif',
    photo: null
  },
  {
    id: 'sem003',
    nom: 'Camara',
    prenom: 'Fatoumata',
    date_naissance: '2001-08-10',
    lieu_naissance: 'Kindia',
    telephone: '+224 623 456 789',
    email: 'fatoumata.camara@example.com',
    adresse: 'Quartier Ratoma, Conakry',
    niveau_etude: 'Bac+1',
    classe: 'Niveau 1',
    statut: 'actif',
    photo: null
  }
];

// Utilitaire pour simuler un délai réseau
export const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));
