import { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet";
import {
  Send,
  Sparkles,
  Zap,
  Cloud,
  Briefcase,
  Shuffle,
  ChevronRight,
  Star,
  Trophy,
  Target,
  ShoppingBag,
  MessageCircle,
  Leaf,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { clothingBoxes } from "@/data/boxes";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  recommendations?: typeof clothingBoxes;
  isTyping?: boolean;
}

interface UserProfile {
  stylePreferences: string[];
  colorPreferences: string[];
  occasions: string[];
  currentStep: number;
}

const styleOptions = [
  { id: "casual", label: "Casual", icon: "👕" },
  { id: "vintage", label: "Vintage", icon: "🕰️" },
  { id: "urban", label: "Urban", icon: "🏙️" },
  { id: "classic", label: "Classique", icon: "👔" },
  { id: "boho", label: "Bohème", icon: "🌸" },
  { id: "minimal", label: "Minimaliste", icon: "◻️" },
];

const colorOptions = [
  { id: "neutral", label: "Neutres", color: "bg-stone-400" },
  { id: "earth", label: "Terre", color: "bg-amber-600" },
  { id: "pastel", label: "Pastels", color: "bg-pink-300" },
  { id: "bold", label: "Vifs", color: "bg-red-500" },
  { id: "dark", label: "Sombres", color: "bg-slate-800" },
  { id: "mixed", label: "Variés", color: "bg-gradient-to-r from-blue-400 to-purple-400" },
];

const occasionOptions = [
  { id: "everyday", label: "Quotidien", icon: "☀️" },
  { id: "work", label: "Travail", icon: "💼" },
  { id: "evening", label: "Soirée", icon: "🌙" },
  { id: "weekend", label: "Weekend", icon: "🎉" },
  { id: "sport", label: "Sport", icon: "🏃" },
  { id: "special", label: "Occasion", icon: "✨" },
];

const quickActions = [
  { id: "surprise", label: "Surprends-moi", icon: Shuffle },
  { id: "weather", label: "Selon la météo", icon: Cloud },
  { id: "work", label: "Tenue pro", icon: Briefcase },
];

const StyleAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Bonjour! 👋 Je suis votre styliste personnel IA. Avant de commencer, j'aimerais mieux vous connaître. Commençons par découvrir votre style!",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    stylePreferences: [],
    colorPreferences: [],
    occasions: [],
    currentStep: 0,
  });
  const [stylePoints, setStylePoints] = useState(100);
  const [recommendations, setRecommendations] = useState<typeof clothingBoxes>([]);

  const scrollRef = useRef<HTMLDivElement>(null);

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

  const simulateTyping = async (content: string, recs?: typeof clothingBoxes) => {
    const typingId = addMessage({ role: "assistant", content: "", isTyping: true });

    await new Promise((r) => setTimeout(r, 1000 + Math.random() * 1000));

    setMessages((prev) =>
      prev.map((m) =>
        m.id === typingId
          ? { ...m, content, isTyping: false, recommendations: recs }
          : m
      )
    );

    if (recs) {
      setRecommendations(recs);
    }
  };

  const handleStyleSelect = (styleId: string) => {
    const styles = userProfile.stylePreferences.includes(styleId)
      ? userProfile.stylePreferences.filter((s) => s !== styleId)
      : [...userProfile.stylePreferences, styleId];

    setUserProfile((prev) => ({ ...prev, stylePreferences: styles }));
  };

  const handleColorSelect = (colorId: string) => {
    const colors = userProfile.colorPreferences.includes(colorId)
      ? userProfile.colorPreferences.filter((c) => c !== colorId)
      : [...userProfile.colorPreferences, colorId];

    setUserProfile((prev) => ({ ...prev, colorPreferences: colors }));
  };

  const handleOccasionSelect = (occasionId: string) => {
    const occasions = userProfile.occasions.includes(occasionId)
      ? userProfile.occasions.filter((o) => o !== occasionId)
      : [...userProfile.occasions, occasionId];

    setUserProfile((prev) => ({ ...prev, occasions }));
  };

  const handleNextStep = async () => {
    if (userProfile.currentStep === 0 && userProfile.stylePreferences.length === 0) {
      toast({ title: "Sélectionnez au moins un style", variant: "destructive" });
      return;
    }
    if (userProfile.currentStep === 1 && userProfile.colorPreferences.length === 0) {
      toast({ title: "Sélectionnez au moins une palette", variant: "destructive" });
      return;
    }
    if (userProfile.currentStep === 2 && userProfile.occasions.length === 0) {
      toast({ title: "Sélectionnez au moins une occasion", variant: "destructive" });
      return;
    }

    setStylePoints((prev) => prev + 50);

    if (userProfile.currentStep < 2) {
      setUserProfile((prev) => ({ ...prev, currentStep: prev.currentStep + 1 }));

      const stepMessages = [
        "Parfait! J'adore vos choix de style. 🎨 Maintenant, parlons couleurs! Quelles palettes vous attirent?",
        "Super! 👗 Dernière question: pour quelles occasions cherchez-vous des tenues?",
      ];

      await simulateTyping(stepMessages[userProfile.currentStep]);
    } else {
      setUserProfile((prev) => ({ ...prev, currentStep: 3 }));

      // Generate recommendations based on profile
      const matchedBoxes = clothingBoxes.filter((box) => {
        const styleMatch = userProfile.stylePreferences.some(
          (s) => box.category.toLowerCase().includes(s) || box.tags.includes(s)
        );
        return styleMatch || Math.random() > 0.5;
      });

      await simulateTyping(
        "Fantastique! 🌟 J'ai analysé votre profil et voici mes recommandations personnalisées. Vous avez gagné le badge 'Style Explorer'! Posez-moi vos questions ou dites-moi ce que vous cherchez.",
        matchedBoxes.slice(0, 3)
      );
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue;
    setInputValue("");
    addMessage({ role: "user", content: userMessage });
    setIsLoading(true);
    setStylePoints((prev) => prev + 10);

    // Simple response logic
    const lowerMessage = userMessage.toLowerCase();
    let response = "";
    let recs: typeof clothingBoxes = [];

    if (lowerMessage.includes("entretien") || lowerMessage.includes("professionnel")) {
      response =
        "Pour un entretien, je vous recommande la box 'Classic Pro' 👔 Elle contient des pièces élégantes mais authentiques. Quelle est l'industrie? Startup ou entreprise traditionnelle?";
      recs = clothingBoxes.filter((b) => b.category === "Classic");
    } else if (lowerMessage.includes("startup") || lowerMessage.includes("tech")) {
      response =
        "Super! Pour une startup tech, le smart casual est parfait. Voici la box 'Classic Pro' avec un twist moderne - vous pouvez garder une touche personnelle tout en restant professionnel. 💼";
      recs = clothingBoxes.filter((b) => ["Classic", "Urban"].includes(b.category));
    } else if (lowerMessage.includes("date") || lowerMessage.includes("soirée")) {
      response =
        "Ooh, une occasion spéciale! 💕 Je vous suggère la box 'Evening Edit' pour quelque chose d'élégant, ou 'Bohemian Spirit' pour un look plus décontracté mais charmant.";
      recs = clothingBoxes.filter((b) => ["Evening", "Boho"].includes(b.category));
    } else if (lowerMessage.includes("vintage") || lowerMessage.includes("rétro")) {
      response =
        "Vous avez du goût! 🕰️ Notre box 'Vintage Revival' est parfaite pour vous - des pièces authentiques des années 70-90 avec beaucoup de caractère.";
      recs = clothingBoxes.filter((b) => b.category === "Vintage");
    } else {
      response =
        "Je comprends! Laissez-moi vous montrer quelques options qui pourraient vous plaire. Dites-moi si vous cherchez quelque chose de particulier. 😊";
      recs = clothingBoxes.slice(0, 3);
    }

    await simulateTyping(response, recs);
    setIsLoading(false);
  };

  const handleQuickAction = async (actionId: string) => {
    setIsLoading(true);
    setStylePoints((prev) => prev + 25);

    const actions: Record<string, { message: string; filter: (b: typeof clothingBoxes[0]) => boolean }> = {
      surprise: {
        message: "Voici une sélection surprise basée sur les tendances actuelles! 🎲",
        filter: () => Math.random() > 0.5,
      },
      weather: {
        message: "Il fait frais aujourd'hui! ☁️ Voici des pièces parfaites pour la saison.",
        filter: (b) => ["Casual", "Urban", "Classic"].includes(b.category),
      },
      work: {
        message: "Pour une journée au bureau, voici mes meilleures recommandations pro! 💼",
        filter: (b) => ["Classic", "Minimal"].includes(b.category),
      },
    };

    const action = actions[actionId];
    addMessage({ role: "user", content: quickActions.find((a) => a.id === actionId)?.label || "" });

    const recs = clothingBoxes.filter(action.filter).slice(0, 3);
    await simulateTyping(action.message, recs);
    setIsLoading(false);
  };

  const progress = ((userProfile.currentStep + 1) / 4) * 100;

  return (
    <>
      <Helmet>
        <title>Assistant Style IA | ReStyle - Trouvez Votre Style</title>
        <meta
          name="description"
          content="Notre assistant IA vous aide à découvrir votre style unique et vous recommande des box de vêtements personnalisées."
        />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />

        <main className="flex-1 container mx-auto px-4 py-6">
          <div className="grid lg:grid-cols-5 gap-6 h-[calc(100vh-140px)]">
            {/* Chat Panel */}
            <div className="lg:col-span-3 flex flex-col bg-card rounded-2xl shadow-card overflow-hidden">
              {/* Header */}
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
                    <p className="text-sm text-muted-foreground">En ligne • Prêt à vous aider</p>
                  </div>
                </div>

                {/* Gamification */}
                <div className="flex items-center gap-4">
                  <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-accent rounded-full">
                    <Star className="h-4 w-4 text-secondary" />
                    <span className="text-sm font-medium">{stylePoints} pts</span>
                  </div>
                  {userProfile.currentStep >= 3 && (
                    <Badge className="bg-primary/10 text-primary">
                      <Trophy className="h-3 w-3 mr-1" />
                      Style Explorer
                    </Badge>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              {userProfile.currentStep < 3 && (
                <div className="px-4 py-3 border-b border-border bg-accent/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Découverte du style</span>
                    <span className="text-sm text-muted-foreground">
                      Étape {userProfile.currentStep + 1}/3
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              {/* Messages */}
              <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex gap-3 animate-fade-in",
                        message.role === "user" && "flex-row-reverse"
                      )}
                    >
                      {message.role === "assistant" && (
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Sparkles className="h-4 w-4 text-primary" />
                        </div>
                      )}
                      <div
                        className={cn(
                          "max-w-[80%] rounded-2xl px-4 py-3",
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        )}
                      >
                        {message.isTyping ? (
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce delay-100" />
                            <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce delay-200" />
                          </div>
                        ) : (
                          <p className="text-sm leading-relaxed">{message.content}</p>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Onboarding Steps */}
                  {userProfile.currentStep === 0 && (
                    <div className="space-y-4 animate-fade-in">
                      <p className="text-sm text-muted-foreground text-center">
                        Sélectionnez vos styles préférés
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {styleOptions.map((style) => (
                          <button
                            key={style.id}
                            onClick={() => handleStyleSelect(style.id)}
                            className={cn(
                              "p-4 rounded-xl border-2 transition-all",
                              userProfile.stylePreferences.includes(style.id)
                                ? "border-primary bg-primary/10"
                                : "border-border hover:border-primary/50"
                            )}
                          >
                            <span className="text-2xl mb-2 block">{style.icon}</span>
                            <span className="text-sm font-medium">{style.label}</span>
                          </button>
                        ))}
                      </div>
                      <Button onClick={handleNextStep} className="w-full">
                        Continuer
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  )}

                  {userProfile.currentStep === 1 && (
                    <div className="space-y-4 animate-fade-in">
                      <p className="text-sm text-muted-foreground text-center">
                        Quelles couleurs préférez-vous?
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {colorOptions.map((color) => (
                          <button
                            key={color.id}
                            onClick={() => handleColorSelect(color.id)}
                            className={cn(
                              "p-4 rounded-xl border-2 transition-all flex items-center gap-3",
                              userProfile.colorPreferences.includes(color.id)
                                ? "border-primary bg-primary/10"
                                : "border-border hover:border-primary/50"
                            )}
                          >
                            <div className={cn("w-6 h-6 rounded-full", color.color)} />
                            <span className="text-sm font-medium">{color.label}</span>
                          </button>
                        ))}
                      </div>
                      <Button onClick={handleNextStep} className="w-full">
                        Continuer
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  )}

                  {userProfile.currentStep === 2 && (
                    <div className="space-y-4 animate-fade-in">
                      <p className="text-sm text-muted-foreground text-center">
                        Pour quelles occasions cherchez-vous des tenues?
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {occasionOptions.map((occasion) => (
                          <button
                            key={occasion.id}
                            onClick={() => handleOccasionSelect(occasion.id)}
                            className={cn(
                              "p-4 rounded-xl border-2 transition-all",
                              userProfile.occasions.includes(occasion.id)
                                ? "border-primary bg-primary/10"
                                : "border-border hover:border-primary/50"
                            )}
                          >
                            <span className="text-2xl mb-2 block">{occasion.icon}</span>
                            <span className="text-sm font-medium">{occasion.label}</span>
                          </button>
                        ))}
                      </div>
                      <Button onClick={handleNextStep} className="w-full">
                        Voir mes recommandations
                        <Sparkles className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Quick Actions */}
              {userProfile.currentStep >= 3 && (
                <div className="px-4 py-3 border-t border-border">
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {quickActions.map((action) => (
                      <Button
                        key={action.id}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickAction(action.id)}
                        disabled={isLoading}
                        className="shrink-0"
                      >
                        <action.icon className="h-4 w-4 mr-2" />
                        {action.label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              {userProfile.currentStep >= 3 && (
                <div className="p-4 border-t border-border">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="flex gap-2"
                  >
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Ex: Je cherche une tenue pour un entretien..."
                      disabled={isLoading}
                      className="flex-1"
                    />
                    <Button type="submit" disabled={isLoading || !inputValue.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              )}
            </div>

            {/* Recommendations Panel */}
            <div className="lg:col-span-2 flex flex-col bg-card rounded-2xl shadow-card overflow-hidden">
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Recommandations
                </h3>
              </div>

              <ScrollArea className="flex-1 p-4">
                {recommendations.length > 0 ? (
                  <div className="space-y-4">
                    {recommendations.map((box, index) => (
                      <div
                        key={box.id}
                        className="bg-background rounded-xl p-4 border border-border hover:border-primary/50 transition-all animate-scale-in cursor-pointer group"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex gap-4">
                          <img
                            src={box.images[0]}
                            alt={box.name}
                            className="w-20 h-20 rounded-lg object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h4 className="font-semibold text-foreground truncate">
                                  {box.name}
                                </h4>
                                <Badge variant="secondary" className="text-xs mt-1">
                                  {box.category}
                                </Badge>
                              </div>
                              <span className="text-lg font-bold text-primary">{box.price}€</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                              {box.description}
                            </p>
                            <div className="flex items-center gap-2 mt-3">
                              <Button size="sm" variant="secondary" className="flex-1">
                                <ShoppingBag className="h-3 w-3 mr-1" />
                                Ajouter
                              </Button>
                              <Button size="sm" variant="outline">
                                <MessageCircle className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Match reason */}
                        <div className="mt-3 pt-3 border-t border-border">
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Sparkles className="h-3 w-3 text-primary" />
                            Correspond à vos préférences de style
                          </p>
                        </div>

                        {/* Sustainability */}
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Leaf className="h-3 w-3 text-primary" />
                            {box.sustainability.co2Saved} CO₂
                          </span>
                          <span>{box.items} articles</span>
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-secondary" />
                            {box.rating}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8">
                    <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mb-4">
                      <Sparkles className="h-8 w-8 text-primary" />
                    </div>
                    <h4 className="font-semibold text-foreground mb-2">
                      Vos recommandations apparaîtront ici
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Complétez le quiz de style pour voir des box personnalisées
                    </p>
                  </div>
                )}
              </ScrollArea>

              {/* Gamification Footer */}
              <div className="p-4 border-t border-border bg-accent/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-secondary" />
                    <span className="text-sm font-medium">Niveau 1</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3].map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center text-xs",
                          i === 0
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {i === 0 ? "🌱" : "🔒"}
                      </div>
                    ))}
                  </div>
                </div>
                <Progress value={30} className="h-1.5 mt-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  70 pts pour débloquer "Eco Warrior"
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default StyleAssistant;
