import { useState } from "react";
import { Star, Leaf, ShoppingBag, Eye, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClothingBox } from "@/data/boxes";
import { cn } from "@/lib/utils";

interface BoxCardProps {
  box: ClothingBox;
  onAddToCart?: (box: ClothingBox) => void;
  onViewDetails?: (box: ClothingBox) => void;
}

const BoxCard = ({ box, onAddToCart, onViewDetails }: BoxCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const savings = Math.round(((box.originalValue - box.price) / box.originalValue) * 100);

  return (
    <div
      className="group card-elevated overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setCurrentImageIndex(0);
      }}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        <img
          src={box.images[currentImageIndex]}
          alt={box.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Image Navigation Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
          {box.images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentImageIndex(idx)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                idx === currentImageIndex
                  ? "bg-card w-6"
                  : "bg-card/50 hover:bg-card/80"
              )}
            />
          ))}
        </div>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <Badge className="bg-secondary text-secondary-foreground">
            -{savings}%
          </Badge>
          <Badge variant="outline" className="bg-card/80 backdrop-blur-sm">
            {box.items} articles
          </Badge>
        </div>

        {/* Quick Actions */}
        <div
          className={cn(
            "absolute top-4 right-4 flex flex-col gap-2 transition-all duration-300",
            isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
          )}
        >
          <Button
            size="icon"
            variant="glass"
            className="h-10 w-10"
            onClick={() => onViewDetails?.(box)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>

        {/* Eco Badge */}
        <div className="absolute bottom-4 right-4">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-primary/90 backdrop-blur-sm rounded-full text-primary-foreground text-xs">
            <Leaf className="h-3 w-3" />
            <span>{box.sustainability.co2Saved} CO₂</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Category */}
        <Badge variant="secondary" className="text-xs">
          {box.category}
        </Badge>

        {/* Title & Description */}
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {box.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {box.description}
          </p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-secondary text-secondary" />
            <span className="text-sm font-medium">{box.rating}</span>
          </div>
          <span className="text-sm text-muted-foreground">
            ({box.reviews} avis)
          </span>
        </div>

        {/* Price */}
        <div className="flex items-end gap-2">
          <span className="text-2xl font-bold text-foreground">{box.price}€</span>
          <span className="text-sm text-muted-foreground line-through mb-1">
            {box.originalValue}€
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {box.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-accent text-accent-foreground text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => onAddToCart?.(box)}
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
          <Button
            variant="outline"
            onClick={() => onViewDetails?.(box)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BoxCard;
