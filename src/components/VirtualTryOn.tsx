import { useState } from "react";
import { Upload, X, Loader2, Check, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ClothingBox } from "@/data/boxes";
import { virtualTryOn, validateImage } from "@/services/bananaApi";

interface VirtualTryOnProps {
  selectedBox: ClothingBox | null;
  onClose: () => void;
  onProceedToCheckout: () => void;
}

export const VirtualTryOn = ({ selectedBox, onClose, onProceedToCheckout }: VirtualTryOnProps) => {
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [tryOnResult, setTryOnResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validation = validateImage(file);
      if (!validation.valid) {
        setError(validation.error || "Fichier invalide");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setUserPhoto(event.target?.result as string);
        setError(null);
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

  const resetState = () => {
    setUserPhoto(null);
    setTryOnResult(null);
    setError(null);
  };

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

          {userPhoto && !tryOnResult && (
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
