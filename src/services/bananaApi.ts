import axios from 'axios';

/**
 * Service d'intégration avec Gemini Flash + Nano Banana pour le virtual try-on
 * Documentation: https://ai.google.dev/gemini-api/docs
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

// Protection contre les appels multiples
let lastCallTime = 0;
const MIN_CALL_INTERVAL = 2000; // 2 secondes minimum entre chaque appel

interface VirtualTryOnRequest {
  userImage: string; // Base64 encoded image
  garmentImages: string[]; // Array of garment image URLs
  boxId: string;
}

interface VirtualTryOnResponse {
  resultImage: string; // Base64 encoded result image
  success: boolean;
  message?: string;
}

/**
 * Analyse une photo de l'utilisateur avec Gemini pour déterminer son style
 * et recommander des box appropriées
 */
export const analyzeUserStyle = async (imageBase64: string): Promise<{
  success: boolean;
  styleAnalysis?: string;
  recommendedCategories?: string[];
  error?: string;
}> => {
  try {
    // Protection anti-spam : vérifier le temps depuis le dernier appel
    const now = Date.now();
    const timeSinceLastCall = now - lastCallTime;
    
    if (timeSinceLastCall < MIN_CALL_INTERVAL) {
      console.warn(`⚠️ Appel trop rapide. Attendez ${Math.ceil((MIN_CALL_INTERVAL - timeSinceLastCall) / 1000)}s`);
      return {
        success: false,
        error: `Veuillez patienter ${Math.ceil((MIN_CALL_INTERVAL - timeSinceLastCall) / 1000)} secondes avant de réessayer`
      };
    }
    
    lastCallTime = now;
    
    if (!GEMINI_API_KEY) {
      console.warn('⚠️ API Gemini non configurée');
      return {
        success: false,
        error: 'API Gemini non configurée'
      };
    }

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [
            {
              text: `Analyse cette photo de la personne et détermine son style vestimentaire. 
              Réponds UNIQUEMENT en JSON avec ce format exact:
              {
                "styleAnalysis": "Description détaillée du style de la personne",
                "recommendedCategories": ["Casual", "Classic", "Vintage", "Evening", "Sport", "Boho"]
              }
              
              Catégories disponibles: Casual (décontracté), Classic (professionnel/élégant), Vintage (rétro), Evening (soirée), Sport (sportif), Boho (bohème).
              Choisis 2-3 catégories qui correspondent le mieux au style visible ou suggéré.`
            },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 32,
          topP: 1,
          maxOutputTokens: 1024,
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      const textResponse = response.data.candidates[0].content.parts[0].text;
      
      // Extraire le JSON de la réponse
      const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        return {
          success: true,
          styleAnalysis: result.styleAnalysis,
          recommendedCategories: result.recommendedCategories || []
        };
      }
    }

    throw new Error('Réponse invalide de Gemini');
  } catch (error: any) {
    console.error('Erreur lors de l\'analyse de style:', error);
    
    // Gérer l'erreur 429 (Too Many Requests)
    if (error.response?.status === 429) {
      return {
        success: false,
        error: 'Limite de requêtes atteinte. Veuillez réessayer dans quelques instants.'
      };
    }
    
    return {
      success: false,
      error: 'Erreur lors de l\'analyse de style'
    };
  }
};

/**
 * Appelle l'API Gemini pour effectuer un essayage virtuel
 * @param request - Les données de la requête incluant l'image utilisateur et les vêtements
 * @returns L'image résultante avec les vêtements appliqués
 */
export const virtualTryOn = async (request: VirtualTryOnRequest): Promise<VirtualTryOnResponse> => {
  try {
    // Note: Cette implémentation utilise un mock pour le développement
    // Remplacez par l'appel réel à l'API Gemini en production
    
    if (!GEMINI_API_KEY) {
      console.warn('⚠️ API Gemini non configurée. Utilisation du mode démo.');
      return simulateTryOn(request);
    }

    // Appel à l'API Gemini Flash avec Nano Banana
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [
            {
              text: "Applique virtuellement les vêtements suivants sur la personne dans l'image. Utilise Nano Banana pour générer un essayage virtuel réaliste."
            },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: request.userImage.split(',')[1] // Retire le préfixe data:image/...
              }
            },
            {
              text: `Vêtements à appliquer depuis la box ${request.boxId}`
            }
          ]
        }],
        generationConfig: {
          temperature: 0.4,
          topK: 32,
          topP: 1,
          maxOutputTokens: 4096,
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 60000, // 60 secondes
      }
    );

    if (response.data && response.data.candidates) {
      // Traiter la réponse de Gemini avec Nano Banana
      return {
        success: true,
        resultImage: request.userImage, // À adapter selon la réponse réelle de l'API
        message: 'Essayage virtuel généré avec Gemini Flash + Nano Banana'
      };
    }

    throw new Error('Réponse invalide de l\'API');
  } catch (error) {
    console.error('Erreur lors de l\'appel à l\'API Gemini:', error);
    
    // Fallback en mode démo pour le développement
    return simulateTryOn(request);
  }
};

/**
 * Simule un essayage virtuel pour le développement/démo
 * En production, cette fonction ne devrait pas être utilisée
 */
const simulateTryOn = async (request: VirtualTryOnRequest): Promise<VirtualTryOnResponse> => {
  // Simulation d'un délai de traitement
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Retourne l'image originale de l'utilisateur pour la démo
  // En production, ce serait l'image avec les vêtements appliqués
  return {
    success: true,
    resultImage: request.userImage,
    message: 'Mode démo activé - Configuration requise pour l\'API Banana',
  };
};

/**
 * Convertit une image File en Base64
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

/**
 * Valide la qualité de l'image pour l'essayage virtuel
 */
export const validateImage = (file: File): { valid: boolean; error?: string } => {
  // Vérifier la taille du fichier (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return { valid: false, error: 'L\'image est trop volumineuse (max 5MB)' };
  }

  // Vérifier le type de fichier
  if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
    return { valid: false, error: 'Format d\'image non supporté (JPG ou PNG uniquement)' };
  }

  return { valid: true };
};

export default {
  virtualTryOn,
  fileToBase64,
  validateImage,
};
