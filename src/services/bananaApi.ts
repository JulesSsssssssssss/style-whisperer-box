import axios from 'axios';

/**
 * Service d'intégration avec l'API Banana pour le virtual try-on
 * Documentation: https://docs.banana.dev/
 */

const BANANA_API_KEY = import.meta.env.VITE_BANANA_API_KEY || '';
const BANANA_MODEL_KEY = import.meta.env.VITE_BANANA_MODEL_KEY || '';

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
 * Appelle l'API Banana pour effectuer un essayage virtuel
 * @param request - Les données de la requête incluant l'image utilisateur et les vêtements
 * @returns L'image résultante avec les vêtements appliqués
 */
export const virtualTryOn = async (request: VirtualTryOnRequest): Promise<VirtualTryOnResponse> => {
  try {
    // Note: Cette implémentation utilise un mock pour le développement
    // Remplacez par l'appel réel à l'API Banana en production
    
    if (!BANANA_API_KEY || !BANANA_MODEL_KEY) {
      console.warn('⚠️ API Banana non configurée. Utilisation du mode démo.');
      return simulateTryOn(request);
    }

    const response = await axios.post(
      'https://api.banana.dev/v4/inference',
      {
        apiKey: BANANA_API_KEY,
        modelKey: BANANA_MODEL_KEY,
        modelInputs: {
          person_image: request.userImage,
          garment_images: request.garmentImages,
          // Paramètres additionnels selon la documentation de Banana
          guidance_scale: 7.5,
          num_inference_steps: 50,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 60000, // 60 secondes
      }
    );

    if (response.data && response.data.modelOutputs) {
      return {
        success: true,
        resultImage: response.data.modelOutputs.output_image,
      };
    }

    throw new Error('Réponse invalide de l\'API');
  } catch (error) {
    console.error('Erreur lors de l\'appel à l\'API Banana:', error);
    
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
