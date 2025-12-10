import { Star, Quote } from "lucide-react";

interface TestimonialCardProps {
  name: string;
  avatar: string;
  text: string;
  rating: number;
  boxPurchased: string;
}

const TestimonialCard = ({
  name,
  avatar,
  text,
  rating,
  boxPurchased,
}: TestimonialCardProps) => {
  return (
    <div className="card-elevated p-6 space-y-4 h-full flex flex-col">
      {/* Quote Icon */}
      <Quote className="h-8 w-8 text-primary/30" />

      {/* Text */}
      <p className="text-foreground/80 flex-1 leading-relaxed">{text}</p>

      {/* Rating */}
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? "fill-secondary text-secondary" : "text-muted"
            }`}
          />
        ))}
      </div>

      {/* Author */}
      <div className="flex items-center gap-3 pt-2 border-t border-border">
        <img
          src={avatar}
          alt={name}
          className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20"
        />
        <div>
          <p className="font-medium text-foreground">{name}</p>
          <p className="text-sm text-muted-foreground">Box: {boxPurchased}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
