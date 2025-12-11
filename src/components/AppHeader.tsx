import { Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

interface AppHeaderProps {
  onSearchChange?: (value: string) => void;
  searchValue?: string;
}

const AppHeader = ({ onSearchChange, searchValue = "" }: AppHeaderProps) => {
  return (
    <div className="bg-gradient-to-b from-background via-primary/5 to-background border-b border-border/50">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Title & Assistant CTA */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
                Découvrez votre style
              </h1>
              <p className="text-muted-foreground">
                Des box de mode seconde main sélectionnées pour vous
              </p>
            </div>
            
            <Link to="/style-assistant">
              <Button variant="secondary" size="lg" className="group">
                <Sparkles className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />
                Assistant IA
              </Button>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Rechercher un style, une occasion, une marque..."
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="pl-12 pr-4 h-12 text-base bg-card border-border/50 focus-visible:ring-primary"
            />
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-6 text-sm">
            {[
              { label: "Box disponibles", value: "24" },
              { label: "Articles sauvés", value: "50K+" },
              { label: "Livraison offerte", value: "Dès 50€" },
            ].map((stat, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span className="text-muted-foreground">{stat.label}:</span>
                <span className="font-semibold text-foreground">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppHeader;
