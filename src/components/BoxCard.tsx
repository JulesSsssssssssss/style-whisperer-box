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
        <div className="absolute top-4 left-4">
          <Badge className="bg-secondary text-secondary-foreground">
            -{savings}%
          </Badge>
        </div>

        {/* Quick Actions */}
        <div
          className={cn(
            "absolute top-4 right-4 transition-all duration-300",
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
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {box.name}
          </h3>
          <Badge variant="secondary" className="text-xs mt-2">
            {box.category}
          </Badge>
        </div>

        {/* Price & Rating */}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-foreground">{box.price}€</span>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-secondary text-secondary" />
            <span className="text-sm font-medium">{box.rating}</span>
          </div>
        </div>

        {/* Action Button */}
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => onAddToCart?.(box)}
        >
          <ShoppingBag className="h-4 w-4 mr-2" />
          Ajouter au panier
        </Button>
      </div>
    </div>
  );
};

export default BoxCard;
