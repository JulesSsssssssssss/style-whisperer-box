import { useState, useMemo } from "react";
import { Helmet } from "react-helmet";
import { Sparkles, Leaf, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import BoxCard from "@/components/BoxCard";
import FilterBar from "@/components/FilterBar";
import TestimonialCard from "@/components/TestimonialCard";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { clothingBoxes, testimonials } from "@/data/boxes";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [cartCount, setCartCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("popular");

  const filteredBoxes = useMemo(() => {
    let boxes = [...clothingBoxes];

    if (selectedCategory !== "All") {
      boxes = boxes.filter((box) => box.category === selectedCategory);
    }

    switch (sortOption) {
      case "price-asc":
        boxes.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        boxes.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        boxes.sort((a, b) => b.rating - a.rating);
        break;
      default:
        boxes.sort((a, b) => b.reviews - a.reviews);
    }

    return boxes;
  }, [selectedCategory, sortOption]);

  const handleAddToCart = (box: typeof clothingBoxes[0]) => {
    setCartCount((prev) => prev + 1);
    toast({
      title: "Ajouté au panier!",
      description: `${box.name} a été ajouté à votre panier.`,
    });
  };

  const handleViewDetails = (box: typeof clothingBoxes[0]) => {
    toast({
      title: box.name,
      description: box.longDescription,
    });
  };

  return (
    <>
      <Helmet>
        <title>ReStyle - Mode Seconde Main | Box de Vêtements Durables</title>
        <meta
          name="description"
          content="Découvrez des box de vêtements de seconde main sélectionnées par notre IA styliste. Mode unique, éco-responsable et adaptée à votre personnalité."
        />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Navbar cartCount={cartCount} />

        <main className="flex-1">
          {/* Hero Section */}
          <Hero />

          {/* AI Stylist CTA */}
          <section className="py-12 bg-primary/5">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 md:p-8 bg-card rounded-2xl shadow-card">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-display font-semibold text-foreground">
                      Pas sûr(e) de votre style?
                    </h2>
                    <p className="text-muted-foreground">
                      Notre assistant IA vous guide vers la box parfaite
                    </p>
                  </div>
                </div>
                <Link to="/style-assistant">
                  <Button variant="secondary" size="lg">
                    Parler à l'assistant
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* Box Grid Section */}
          <section className="py-16" id="boxes">
            <div className="container mx-auto px-4">
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                  Nos Box Éco-Responsables
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Chaque box est soigneusement composée de pièces de seconde main
                  sélectionnées pour leur qualité et leur style unique.
                </p>
              </div>

              <FilterBar
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                sortOption={sortOption}
                onSortChange={setSortOption}
              />

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredBoxes.map((box, index) => (
                  <div
                    key={box.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <BoxCard
                      box={box}
                      onAddToCart={handleAddToCart}
                      onViewDetails={handleViewDetails}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Sustainability Section */}
          <section className="py-16 gradient-hero">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary mb-4">
                  <Leaf className="h-4 w-4" />
                  <span className="text-sm font-medium">Notre Impact</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                  Mode Circulaire, Impact Réel
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Chaque vêtement que vous choisissez contribue à un futur plus durable.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    value: "50,000+",
                    label: "Vêtements Sauvés",
                    description: "Articles retirés du circuit de déchets textile",
                  },
                  {
                    value: "30 tonnes",
                    label: "CO₂ Économisé",
                    description: "Équivalent à 150,000 km en voiture",
                  },
                  {
                    value: "5M litres",
                    label: "Eau Préservée",
                    description: "Grâce à la réutilisation des textiles",
                  },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="text-center p-8 bg-card rounded-2xl shadow-card animate-slide-up"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <p className="text-4xl font-display font-bold text-primary mb-2">
                      {stat.value}
                    </p>
                    <p className="text-lg font-semibold text-foreground mb-1">
                      {stat.label}
                    </p>
                    <p className="text-sm text-muted-foreground">{stat.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                  Ce que disent nos clients
                </h2>
                <p className="text-muted-foreground">
                  Rejoignez notre communauté de fashion lovers éco-responsables
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={testimonial.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <TestimonialCard {...testimonial} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Index;
