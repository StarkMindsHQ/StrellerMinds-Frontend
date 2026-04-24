import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  validateQueryParams,
  createApiSuccess,
  createApiError,
} from '@/lib/api-validation';

// Schema for translation request
export const translationQuerySchema = z.object({
  lang: z.enum(['en', 'fr', 'es']).default('en'),
});

// Mock translation data - in production this would come from the database
// (CourseTranslation model)
const translationData: Record<string, Record<string, any>> = {
  'blockchain-fundamentals': {
    en: {
      title: 'Fundamentals of Blockchain Technology',
      description:
        'Learn the core concepts of blockchain, distributed ledgers, and consensus mechanisms.',
      lessons: [
        {
          id: 'lesson-1',
          title: 'Introduction to Blockchain',
          description:
            'Understanding the basics of blockchain technology and its revolutionary impact.',
        },
        {
          id: 'lesson-2',
          title: 'Cryptographic Foundations',
          description:
            'Explore the cryptographic principles that secure blockchain networks.',
        },
        {
          id: 'lesson-3',
          title: 'Distributed Ledger Technology',
          description:
            'Deep dive into how distributed ledgers work and their advantages.',
        },
        {
          id: 'lesson-4',
          title: 'Consensus Mechanisms',
          description:
            'Learn about Proof of Work, Proof of Stake, and other consensus algorithms.',
        },
        {
          id: 'lesson-5',
          title: 'Smart Contracts Basics',
          description:
            'Introduction to smart contracts and their role in blockchain ecosystems.',
        },
        {
          id: 'lesson-6',
          title: 'Blockchain Networks',
          description:
            'Understanding public, private, and consortium blockchain networks.',
        },
        {
          id: 'lesson-7',
          title: 'Security and Vulnerabilities',
          description:
            'Common security issues in blockchain and how to mitigate them.',
        },
        {
          id: 'lesson-8',
          title: 'Future of Blockchain',
          description:
            'Exploring emerging trends and the future potential of blockchain technology.',
        },
      ],
    },
    fr: {
      title: 'Fondements de la Technologie Blockchain',
      description:
        'Apprenez les concepts de base de la blockchain, des registres distribués et des mécanismes de consensus.',
      lessons: [
        {
          id: 'lesson-1',
          title: 'Introduction à la Blockchain',
          description:
            'Comprendre les bases de la technologie blockchain et son impact révolutionnaire.',
        },
        {
          id: 'lesson-2',
          title: 'Fondements Cryptographiques',
          description:
            'Explorez les principes cryptographiques qui sécurisent les réseaux blockchain.',
        },
        {
          id: 'lesson-3',
          title: 'Technologie des Registres Distribués',
          description:
            'Approfondissez le fonctionnement des registres distribués et leurs avantages.',
        },
        {
          id: 'lesson-4',
          title: 'Mécanismes de Consensus',
          description:
            "Découvrez la Preuve de Travail, la Preuve d'Enjeu et autres algorithmes de consensus.",
        },
        {
          id: 'lesson-5',
          title: 'Bases des Contrats Intelligents',
          description:
            'Introduction aux contrats intelligents et leur rôle dans les écosystèmes blockchain.',
        },
        {
          id: 'lesson-6',
          title: 'Réseaux Blockchain',
          description:
            'Comprendre les réseaux blockchain publics, privés et consortiums.',
        },
        {
          id: 'lesson-7',
          title: 'Sécurité et Vulnérabilités',
          description:
            'Problèmes de sécurité courants dans la blockchain et comment les atténuer.',
        },
        {
          id: 'lesson-8',
          title: "L'Avenir de la Blockchain",
          description:
            'Explorer les tendances émergentes et le potentiel futur de la technologie blockchain.',
        },
      ],
    },
    es: {
      title: 'Fundamentos de la Tecnología Blockchain',
      description:
        'Aprende los conceptos básicos de blockchain, libros mayores distribuidos y mecanismos de consenso.',
      lessons: [
        {
          id: 'lesson-1',
          title: 'Introducción a Blockchain',
          description:
            'Comprender los conceptos básicos de la tecnología blockchain y su impacto revolucionario.',
        },
        {
          id: 'lesson-2',
          title: 'Fundamentos Criptográficos',
          description:
            'Explora los principios criptográficos que aseguran las redes blockchain.',
        },
        {
          id: 'lesson-3',
          title: 'Tecnología de Libro Mayor Distribuido',
          description:
            'Profundiza en cómo funcionan los libros mayores distribuidos y sus ventajas.',
        },
        {
          id: 'lesson-4',
          title: 'Mecanismos de Consenso',
          description:
            'Aprende sobre Proof of Work, Proof of Stake y otros algoritmos de consenso.',
        },
        {
          id: 'lesson-5',
          title: 'Conceptos Básicos de Contratos Inteligentes',
          description:
            'Introducción a los contratos inteligentes y su papel en los ecosistemas blockchain.',
        },
        {
          id: 'lesson-6',
          title: 'Redes Blockchain',
          description:
            'Comprensión de las redes blockchain públicas, privadas y de consorcio.',
        },
        {
          id: 'lesson-7',
          title: 'Seguridad y Vulnerabilidades',
          description:
            'Problemas de seguridad comunes en blockchain y cómo mitigarlos.',
        },
        {
          id: 'lesson-8',
          title: 'El Futuro de Blockchain',
          description:
            'Explorando tendencias emergentes y el potencial futuro de la tecnología blockchain.',
        },
      ],
    },
  },
  'stellar-smart-contracts': {
    en: {
      title: 'Stellar Smart Contracts Development',
      description:
        'Master smart contract development on the Stellar blockchain using Soroban.',
      lessons: [
        {
          id: 'lesson-1',
          title: 'Introduction to Stellar',
          description:
            'Overview of the Stellar network and its unique features.',
        },
        {
          id: 'lesson-2',
          title: 'Soroban Overview',
          description: 'Introduction to Soroban smart contracts platform.',
        },
        {
          id: 'lesson-3',
          title: 'Contract Structure',
          description:
            'Understanding the structure and components of a Soroban contract.',
        },
        {
          id: 'lesson-4',
          title: 'Security Best Practices',
          description:
            'Learn security best practices for smart contract development.',
        },
      ],
    },
    fr: {
      title: 'Développement de Smart Contracts Stellar',
      description:
        'Maîtrisez le développement de contrats intelligents sur la blockchain Stellar avec Soroban.',
      lessons: [
        {
          id: 'lesson-1',
          title: 'Introduction à Stellar',
          description:
            'Aperçu du réseau Stellar et de ses fonctionnalités uniques.',
        },
        {
          id: 'lesson-2',
          title: 'Aperçu de Soroban',
          description:
            'Introduction à la plateforme de contrats intelligents Soroban.',
        },
        {
          id: 'lesson-3',
          title: 'Structure des Contrats',
          description:
            "Comprendre la structure et les composants d'un contrat Soroban.",
        },
        {
          id: 'lesson-4',
          title: 'Meilleures Pratiques de Sécurité',
          description:
            'Apprenez les meilleures pratiques de sécurité pour le développement de contrats intelligents.',
        },
      ],
    },
    es: {
      title: 'Desarrollo de Smart Contracts en Stellar',
      description:
        'Domina el desarrollo de contratos inteligentes en la blockchain Stellar usando Soroban.',
      lessons: [
        {
          id: 'lesson-1',
          title: 'Introducción a Stellar',
          description:
            'Vista general de la red Stellar y sus características únicas.',
        },
        {
          id: 'lesson-2',
          title: 'Visión General de Soroban',
          description:
            'Introducción a la plataforma de contratos inteligentes Soroban.',
        },
        {
          id: 'lesson-3',
          title: 'Estructura de Contratos',
          description:
            'Comprender la estructura y componentes de un contrato Soroban.',
        },
        {
          id: 'lesson-4',
          title: 'Mejores Prácticas de Seguridad',
          description:
            'Aprende las mejores prácticas de seguridad para el desarrollo de contratos inteligentes.',
        },
      ],
    },
  },
  'defi-fundamentals': {
    en: {
      title: 'DeFi Fundamentals',
      description:
        'Explore the world of decentralized finance and learn how to build financial applications.',
      lessons: [
        { id: 'lesson-1', title: 'Introduction to DeFi' },
        { id: 'lesson-2', title: 'Liquidity Pools' },
        { id: 'lesson-3', title: 'Yield Farming' },
        { id: 'lesson-4', title: 'Risk Management' },
      ],
    },
    fr: {
      title: 'Fondements de la DeFi',
      description: 'Explorez le monde de la finance décentralisée.',
      lessons: [
        { id: 'lesson-1', title: 'Introduction à la DeFi' },
        { id: 'lesson-2', title: 'Pools de Liquidité' },
        { id: 'lesson-3', title: 'Yield Farming' },
        { id: 'lesson-4', title: 'Gestion des Risques' },
      ],
    },
    es: {
      title: 'Fundamentos de DeFi',
      description: 'Explora el mundo de las finanzas descentralizadas.',
      lessons: [
        { id: 'lesson-1', title: 'Introducción a DeFi' },
        { id: 'lesson-2', title: 'Pools de Liquidez' },
        { id: 'lesson-3', title: 'Yield Farming' },
        { id: 'lesson-4', title: 'Gestión de Riesgos' },
      ],
    },
  },
  'nft-development': {
    en: {
      title: 'NFT Development and Marketplace',
      description:
        'Build your own NFT collection and marketplace on the Stellar blockchain.',
      lessons: [
        { id: 'lesson-1', title: 'NFT Standards' },
        { id: 'lesson-2', title: 'Minting NFTs' },
        { id: 'lesson-3', title: 'Marketplace Architecture' },
        { id: 'lesson-4', title: 'Trading and bidding' },
      ],
    },
    fr: {
      title: 'Développement NFT et Marketplace',
      description:
        'Créez votre propre collection NFT et marketplace sur Stellar.',
      lessons: [
        { id: 'lesson-1', title: 'Normes NFT' },
        { id: 'lesson-2', title: 'Frappe NFT' },
        { id: 'lesson-3', title: 'Architecture du Marché' },
        { id: 'lesson-4', title: 'Trading et enchères' },
      ],
    },
    es: {
      title: 'Desarrollo de NFTs y Marketplace',
      description:
        'Construye tu propia colección NFT y marketplace en Stellar.',
      lessons: [
        { id: 'lesson-1', title: 'Estándares NFT' },
        { id: 'lesson-2', title: 'Acuñación de NFTs' },
        { id: 'lesson-3', title: 'Arquitectura del Marketplace' },
        { id: 'lesson-4', title: 'Trading y pujas' },
      ],
    },
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> },
) {
  try {
    const { courseId } = await params;

    // Validate query parameters
    const validation = validateQueryParams(request, translationQuerySchema);
    if (!validation.success) {
      return validation.response;
    }

    const { lang } = validation.data;

    // Get translations for this course and language
    const courseTranslations = translationData[courseId];
    if (!courseTranslations) {
      return createApiError('Translations not found for this course', 404);
    }

    const translation = courseTranslations[lang];
    if (!translation) {
      // Fallback to English if translation not available
      return createApiSuccess(
        'Translation not available in selected language, falling back to English',
        {
          courseId,
          language: 'en',
          translation: courseTranslations.en,
          fallback: true,
        },
      );
    }

    return createApiSuccess('Translation retrieved successfully', {
      courseId,
      language: lang,
      translation,
      fallback: false,
    });
  } catch (error) {
    console.error('Error in GET /api/courses/[courseId]/translations:', error);
    return createApiError('An unexpected error occurred', 500);
  }
}
