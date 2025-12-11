import { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet";
import {
  Send,
  Sparkles,
  ShoppingBag,
  Shirt,
  Wand2,
  Star,
  Leaf,
  Target,
  Plus,
  Camera,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { clothingBoxes, type ClothingBox } from "@/data/boxes";
import { cn } from "@/lib/utils";
import VirtualTryOn from "@/components/VirtualTryOn";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  recommendations?: typeof clothingBoxes;
  outfitSuggestion?: {
    items: { name: string; type: string; color: string }[];
    occasion: string;
    tips: string;
  };
  isTyping?: boolean;
}

const wardrobeItems = [
  { id: "1", name: "Jean slim noir", type: "Pantalon", color: "Noir", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=200&h=200&fit=crop" },
  { id: "2", name: "Chemise blanche", type: "Haut", color: "Blanc", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200&h=200&fit=crop" },
  { id: "3", name: "Pull gris", type: "Haut", color: "Gris", image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=200&h=200&fit=crop" },
  { id: "4", name: "Veste en jean", type: "Veste", color: "Bleu", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200&h=200&fit=crop" },
  { id: "5", name: "Robe noire", type: "Robe", color: "Noir", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200&h=200&fit=crop" },
  { id: "6", name: "Baskets blanches", type: "Chaussures", color: "Blanc", image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=200&h=200&fit=crop" },
];

const StyleAssistant = () => {
  const [activeTab, setActiveTab] = useState<"boxes" | "outfits">("boxes");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<typeof clothingBoxes>([]);
  const [outfitSuggestion, setOutfitSuggestion] = useState<Message["outfitSuggestion"] | null>(null);
  const [stylePoints, setStylePoints] = useState(100);
  const [showVirtualTryOn, setShowVirtualTryOn] = useState(false);
  const [selectedBoxForTryOn, setSelectedBoxForTryOn] = useState<ClothingBox | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab === "boxes") {
      setMessages([
        {
          id: "1",
          role: "assistant",
          content: "Bonjour! 👋 Je suis votre styliste personnel IA. Je peux vous aider à découvrir des box de vêtements qui correspondent parfaitement à votre style. Que recherchez-vous aujourd'hui?",
        },
      ]);
      setRecommendations([]);
      setOutfitSuggestion(null);
    } else {
      setMessages([
        {
          id: "1",
          role: "assistant",
          content: "Hello! 👔 Je suis là pour vous aider à créer des tenues avec les vêtements de votre dressing. Décrivez-moi l'occasion ou le style que vous recherchez, et je vous proposerai des combinaisons!",
        },
      ]);
      setRecommendations([]);
      setOutfitSuggestion(null);
    }
    setInputValue("");
  }, [activeTab]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const addMessage = (message: Omit<Message, "id">) => {
    const newMessage = { ...message, id: Date.now().toString() };
    setMessages((prev) => [...prev, newMessage]);
    return newMessage.id;
  };

  const simulateTyping = async (
    content: string,
    recs?: typeof clothingBoxes,
    outfit?: Message["outfitSuggestion"]
  ) => {
    const typingId = addMessage({ role: "assistant", content: "", isTyping: true });
    await new Promise((r) => setTimeout(r, 1000 + Math.random() * 1000));
    setMessages((prev) =>
      prev.map((m) =>
        m.id === typingId
          ? { ...m, content, isTyping: false, recommendations: recs, outfitSuggestion: outfit }
          : m
      )
    );
    if (recs) setRecommendations(recs);
    if (outfit) setOutfitSuggestion(outfit);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    const userMessage = inputValue;
    setInputValue("");
    addMessage({ role: "user", content: userMessage });
    setIsLoading(true);
    setStylePoints((prev) => prev + 10);
    const lowerMessage = userMessage.toLowerCase();

    if (activeTab === "boxes") {
      let response = "";
      let recs: typeof clothingBoxes = [];
      if (lowerMessage.includes("entretien") || lowerMessage.includes("professionnel")) {
        response = "Pour un entretien, je vous recommande la box 'Classic Pro' 👔 Elle contient des pièces élégantes et professionnelles parfaites pour faire bonne impression! Vous pouvez aussi essayer virtuellement ces vêtements sur vous.";
        recs = clothingBoxes.filter((b) => b.category === "Classic").slice(0, 3);
      } else if (lowerMessage.includes("soirée") || lowerMessage.includes("sortie")) {
        response = "Pour une soirée, voici des box parfaites pour briller! ✨ N'hésitez pas à les essayer virtuellement.";
        recs = clothingBoxes.filter((b) => ["Evening", "Boho"].includes(b.category)).slice(0, 3);
      } else {
        response = "Voici une sélection de box qui pourraient vous plaire! 😊 Vous pouvez visualiser comment elles vous iraient avec l'essayage virtuel.";
        recs = clothingBoxes.slice(0, 3);
      }
      await simulateTyping(response, recs);
    } else {
      let response = "";
      let outfit: Message["outfitSuggestion"] = { items: [], occasion: "", tips: "" };
      if (lowerMessage.includes("entretien") || lowerMessage.includes("professionnel")) {
        response = "Voici ma suggestion pour un look professionnel! 💼";
        outfit = {
          items: [
            { name: "Chemise blanche", type: "Haut", color: "Blanc" },
            { name: "Jean slim noir", type: "Pantalon", color: "Noir" },
            { name: "Veste en jean", type: "Veste", color: "Bleu" },
          ],
          occasion: "Entretien professionnel",
          tips: "La chemise blanche est un classique intemporel. Le jean noir apporte une touche moderne!",
        };
      } else {
        response = "Voici une suggestion de tenue polyvalente! 😊";
        outfit = {
          items: [
            { name: "Pull gris", type: "Haut", color: "Gris" },
            { name: "Jean slim noir", type: "Pantalon", color: "Noir" },
          ],
          occasion: "Look casual",
          tips: "Un look simple et efficace!",
        };
      }
      await simulateTyping(response, undefined, outfit);
    }
    setIsLoading(false);
  };

  const handleTryOnBox = (box: ClothingBox) => {
    setSelectedBoxForTryOn(box);
    setShowVirtualTryOn(true);
  };

  const handleCloseVirtualTryOn = () => {
    setShowVirtualTryOn(false);
    setSelectedBoxForTryOn(null);
  };

  const handleProceedToCheckout = () => {
    // TODO: Implémenter la redirection vers le paiement
    alert(`Redirection vers le paiement pour: ${selectedBoxForTryOn?.name}`);
    handleCloseVirtualTryOn();
  };

  return (
    <>
      <Helmet>
        <title>Assistant Style IA | ReStyle</title>
      </Helmet>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-6">
          <div className="mb-6">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "boxes" | "outfits")}>
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                <TabsTrigger value="boxes" className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  Découvrir des Box
                </TabsTrigger>
                <TabsTrigger value="outfits" className="flex items-center gap-2">
                  <Wand2 className="h-4 w-4" />
                  Créer des Outfits
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="grid lg:grid-cols-5 gap-6 h-[calc(100vh-200px)]">
            <div className="lg:col-span-3 flex flex-col bg-card rounded-2xl shadow-card overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-primary rounded-full border-2 border-card" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-foreground">Styliste IA</h2>
                    <p className="text-sm text-muted-foreground">
                      {activeTab === "boxes" ? "Mode: Découverte Box" : "Mode: Création Outfits"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-accent rounded-full">
                  <Star className="h-4 w-4 text-secondary" />
                  <span className="text-sm font-medium">{stylePoints} pts</span>
                </div>
              </div>
              <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}>
                      <div className={cn("max-w-[80%] rounded-2xl px-4 py-3", message.role === "user" ? "bg-primary text-primary-foreground" : "bg-accent text-foreground")}>
                        <p className="text-sm">{message.content}</p>
                        {message.isTyping && (
                          <div className="flex gap-1 mt-2">
                            <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-current rounded-full animate-bounce delay-100" />
                            <div className="w-2 h-2 bg-current rounded-full animate-bounce delay-200" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="p-4 border-t border-border">
                <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={activeTab === "boxes" ? "Ex: Je cherche une box pour un entretien..." : "Ex: Crée-moi une tenue pour un dîner..."}
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={isLoading || !inputValue.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>
            <div className="lg:col-span-2 flex flex-col bg-card rounded-2xl shadow-card overflow-hidden">
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  {activeTab === "boxes" ? "Box Recommandées" : "Suggestions d'Outfits"}
                </h3>
              </div>
              <ScrollArea className="flex-1 p-4">
                {activeTab === "boxes" && recommendations.length > 0 && (
                  <div className="space-y-4">
                    {recommendations.map((box) => (
                      <div key={box.id} className="bg-background rounded-xl p-4 border border-border hover:border-primary/50 transition-all cursor-pointer group">
                        <div className="flex gap-4">
                          <img src={box.images[0]} alt={box.name} className="w-20 h-20 rounded-lg object-cover group-hover:scale-105 transition-transform" />
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground">{box.name}</h4>
                            <Badge variant="secondary" className="text-xs mt-1">{box.category}</Badge>
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{box.description}</p>
                            <div className="flex gap-2 mt-3">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="flex-1"
                                onClick={() => handleTryOnBox(box)}
                              >
                                <Camera className="h-3 w-3 mr-1" />
                                Essayer
                              </Button>
                              <Button size="sm" variant="secondary" className="flex-1">
                                <ShoppingBag className="h-3 w-3 mr-1" />
                                Ajouter
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {activeTab === "outfits" && outfitSuggestion && (
                  <div className="space-y-4">
                    <div className="bg-background rounded-xl p-4 border border-border">
                      <div className="flex items-center gap-2 mb-4">
                        <Shirt className="h-5 w-5 text-primary" />
                        <h4 className="font-semibold text-foreground">{outfitSuggestion.occasion}</h4>
                      </div>
                      <div className="space-y-3 mb-4">
                        {outfitSuggestion.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Shirt className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{item.name}</p>
                              <p className="text-xs text-muted-foreground">{item.type} • {item.color}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 bg-primary/5 rounded-lg">
                        <p className="text-sm">{outfitSuggestion.tips}</p>
                      </div>
                    </div>
                    <div className="bg-background rounded-xl p-4 border border-border">
                      <h4 className="font-semibold mb-3">Votre Dressing</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {wardrobeItems.map((item) => (
                          <img key={item.id} src={item.image} alt={item.name} className="w-full aspect-square object-cover rounded-lg" />
                        ))}
                      </div>
                      <Button variant="outline" size="sm" className="w-full mt-3">
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter
                      </Button>
                    </div>
                  </div>
                )}
                {!recommendations.length && !outfitSuggestion && (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8">
                    <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mb-4">
                      {activeTab === "boxes" ? <ShoppingBag className="h-8 w-8 text-primary" /> : <Wand2 className="h-8 w-8 text-primary" />}
                    </div>
                    <h4 className="font-semibold mb-2">{activeTab === "boxes" ? "Vos recommandations apparaîtront ici" : "Vos suggestions apparaîtront ici"}</h4>
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
        </main>
        
        {showVirtualTryOn && (
          <VirtualTryOn
            selectedBox={selectedBoxForTryOn}
            onClose={handleCloseVirtualTryOn}
            onProceedToCheckout={handleProceedToCheckout}
          />
        )}
      </div>
    </>
  );
};

export default StyleAssistant;