import { useState } from "react";
import { Upload, X, Loader2, Check, Image as ImageIcon, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ClothingBox } from "@/data/boxes";
import { virtualTryOn, validateImage, analyzeUserStyle } from "@/services/bananaApi";
import { clothingBoxes } from "@/data/boxes";

interface VirtualTryOnProps {
  selectedBox: ClothingBox | null;
  onClose: () => void;
  onProceedToCheckout: () => void;
}

export const VirtualTryOn = ({ selectedBox, onClose, onProceedToCheckout }: VirtualTryOnProps) => {
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [tryOnResult, setTryOnResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [styleAnalysis, setStyleAnalysis] = useState<string | null>(null);
  const [recommendedBoxes, setRecommendedBoxes] = useState<ClothingBox[]>([]);
  const [hasAnalyzed, setHasAnalyzed] = useState(false); // Empêcher les appels multiples

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validation = validateImage(file);
      if (!validation.valid) {
        setError(validation.error || "Fichier invalide");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Image = event.target?.result as string;
        setUserPhoto(base64Image);
        setError(null);
        
        // Si aucune box n'est sélectionnée, analyser le style automatiquement
        // MAIS seulement si on n'a pas déjà analysé cette photo
        if (!selectedBox && !hasAnalyzed && !isAnalyzing) {
          setIsAnalyzing(true);
          setHasAnalyzed(true); // Marquer comme analysé pour éviter les doublons
          setError(null);
          try {
            const analysis = await analyzeUserStyle(base64Image);
            if (analysis.success && analysis.recommendedCategories) {
              setStyleAnalysis(analysis.styleAnalysis || '');
              
              // Filtrer les box selon les catégories recommandées
              const filtered = clothingBoxes.filter(box => 
                analysis.recommendedCategories?.includes(box.category)
              ).slice(0, 3);
              
              setRecommendedBoxes(filtered);
            } else if (analysis.error) {
              setError(analysis.error);
            }
          } catch (err) {
            console.error('Erreur d\'analyse:', err);
            setError("Une erreur s'est produite lors de l'analyse.");
          } finally {
            setIsAnalyzing(false);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTryOn = async () => {
    if (!userPhoto || !selectedBox) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const result = await virtualTryOn({
        userImage: userPhoto,
        boxId: selectedBox.id,
        garmentImages: selectedBox.images,
      });
      
      if (result.success) {
        setTryOnResult(result.resultImage);
        if (result.message) {
          console.info(result.message);
        }
      } else {
        throw new Error(result.message || 'Erreur lors du traitement');
      }
    } catch (err) {
      setError("Une erreur s'est produite. Veuillez réessayer.");
      console.error('Virtual try-on error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTryOnRecommendedBox = async (box: ClothingBox) => {
    if (!userPhoto) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const result = await virtualTryOn({
        userImage: userPhoto,
        boxId: box.id,
        garmentImages: box.images,
      });
      
      if (result.success) {
        setTryOnResult(result.resultImage);
      }
    } catch (err) {
      setError("Une erreur s'est produite.");
      console.error('Virtual try-on error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetState = () => {
    setUserPhoto(null);
    setTryOnResult(null);
    setError(null);
    setStyleAnalysis(null);
    setRecommendedBoxes([]);
    setHasAnalyzed(false); // Réinitialiser pour permettre une nouvelle analyse
  };

  if (!selectedBox && recommendedBoxes.length === 0 && !isAnalyzing && !userPhoto) {
    // Mode: Télécharger une photo pour analyse de style
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                Découvrez votre style
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Téléchargez votre photo et Gemini vous recommandera les box parfaites
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive text-sm mb-4">
              {error}
            </div>
          )}

          <label 
            htmlFor="photo-upload" 
            className={cn(
              "flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer transition-colors",
              "border-border hover:border-primary/50 bg-accent/30 hover:bg-accent/50"
            )}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="h-12 w-12 text-muted-foreground mb-3" />
              <p className="mb-2 text-sm font-medium text-foreground">
                Cliquez pour télécharger votre photo
              </p>
              <p className="text-xs text-muted-foreground">
                Photo en pied (PNG, JPG, max 5MB)
              </p>
            </div>
            <input 
              id="photo-upload" 
              type="file" 
              className="hidden" 
              accept="image/*"
              onChange={handleFileUpload}
            />
          </label>
          
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mt-4">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              💡 <strong>IA Gemini:</strong> Envoyez une photo et je vais analyser votre style 
              pour vous recommander les box qui vous correspondent le mieux !
            </p>
          </div>
        </Card>
      </div>
    );
  }

  // Mode: Affichage des recommandations après analyse
  if (!selectedBox && recommendedBoxes.length > 0) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-card">
          <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10">
            <div>
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                Vos recommandations
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Voici les box qui correspondent à votre style
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="p-6 space-y-6">
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive text-sm">
                {error}
              </div>
            )}

            {isAnalyzing && (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-lg font-medium">Gemini analyse votre style...</p>
                <p className="text-sm text-muted-foreground">Cela prendra quelques secondes</p>
              </div>
            )}

            {userPhoto && !isAnalyzing && (
              <>
                <div className="relative">
                  <img 
                    src={userPhoto} 
                    alt="Votre photo" 
                    className="w-full max-h-64 object-contain rounded-xl bg-accent"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={resetState}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {styleAnalysis && (
                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground mb-1">Analyse de votre style</p>
                        <p className="text-sm text-muted-foreground">{styleAnalysis}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-foreground mb-3">Box recommandées pour vous</h3>
                  <div className="space-y-3">
                    {recommendedBoxes.map((box) => (
                      <div key={box.id} className="bg-background rounded-xl p-4 border border-border hover:border-primary/50 transition-all">
                        <div className="flex gap-4">
                          <img src={box.images[0]} alt={box.name} className="w-20 h-20 rounded-lg object-cover" />
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground">{box.name}</h4>
                            <Badge variant="secondary" className="text-xs mt-1">{box.category}</Badge>
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{box.description}</p>
                            <Button 
                              size="sm" 
                              className="w-full mt-3"
                              onClick={() => handleTryOnRecommendedBox(box)}
                              disabled={isProcessing}
                            >
                              {isProcessing ? (
                                <>
                                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                  Essayage...
                                </>
                              ) : (
                                <>
                                  <ImageIcon className="h-3 w-3 mr-1" />
                                  Essayer cette box
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>
    );
  }

  if (!selectedBox) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-card">
        <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Essayage Virtuel</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Visualisez comment {selectedBox.name} vous irait
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Selected Box Info */}
          <div className="bg-accent/50 rounded-lg p-4 flex items-center gap-4">
            <img 
              src={selectedBox.images[0]} 
              alt={selectedBox.name}
              className="w-20 h-20 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{selectedBox.name}</h3>
              <p className="text-sm text-muted-foreground">{selectedBox.description}</p>
              <Badge variant="secondary" className="mt-2">{selectedBox.category}</Badge>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">{selectedBox.price}€</p>
              <p className="text-xs text-muted-foreground line-through">{selectedBox.originalValue}€</p>
            </div>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive text-sm">
              {error}
            </div>
          )}

          {!userPhoto && !tryOnResult && (
            <div className="space-y-4">
              <label 
                htmlFor="photo-upload" 
                className={cn(
                  "flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer transition-colors",
                  "border-border hover:border-primary/50 bg-accent/30 hover:bg-accent/50"
                )}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="h-12 w-12 text-muted-foreground mb-3" />
                  <p className="mb-2 text-sm font-medium text-foreground">
                    Cliquez pour télécharger votre photo
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Photo en pied (PNG, JPG, max 5MB)
                  </p>
                </div>
                <input 
                  id="photo-upload" 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileUpload}
                />
              </label>
              
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  💡 <strong>Conseil:</strong> Pour un meilleur résultat, utilisez une photo en pied 
                  prise de face, avec un fond uni et une bonne luminosité.
                </p>
              </div>
            </div>
          )}

          {userPhoto && selectedBox && !tryOnResult && (
            <div className="space-y-4">
              <div className="relative">
                <img 
                  src={userPhoto} 
                  alt="Votre photo" 
                  className="w-full max-h-96 object-contain rounded-xl bg-accent"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={resetState}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <Button 
                onClick={handleTryOn} 
                disabled={isProcessing}
                className="w-full h-12 text-lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Essayage en cours...
                  </>
                ) : (
                  <>
                    <ImageIcon className="mr-2 h-5 w-5" />
                    Lancer l'essayage virtuel
                  </>
                )}
              </Button>
            </div>
          )}

          {tryOnResult && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Photo originale</p>
                  <img 
                    src={userPhoto!} 
                    alt="Original" 
                    className="w-full rounded-xl object-contain bg-accent"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Avec {selectedBox.name}</p>
                  <img 
                    src={tryOnResult} 
                    alt="Résultat" 
                    className="w-full rounded-xl object-contain bg-accent"
                  />
                </div>
              </div>

              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-center gap-3">
                <Check className="h-5 w-5 text-green-600" />
                <p className="text-sm text-green-700 dark:text-green-300">
                  <strong>Ça vous va bien !</strong> Prêt(e) à passer commande ?
                </p>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={resetState}
                  className="flex-1"
                >
                  Réessayer
                </Button>
                <Button 
                  onClick={onProceedToCheckout}
                  className="flex-1"
                >
                  Procéder au paiement
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default VirtualTryOn;
