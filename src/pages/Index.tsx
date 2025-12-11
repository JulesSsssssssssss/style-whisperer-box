import { useState, useMemo } from "react";
import { Helmet } from "react-helmet";
import Navbar from "@/components/Navbar";
import AppHeader from "@/components/AppHeader";
import BoxCard from "@/components/BoxCard";
import FilterBar from "@/components/FilterBar";
import Footer from "@/components/Footer";
import { clothingBoxes } from "@/data/boxes";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [cartCount, setCartCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("popular");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBoxes = useMemo(() => {
    let boxes = [...clothingBoxes];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      boxes = boxes.filter(
        (box) =>
          box.name.toLowerCase().includes(query) ||
          box.description.toLowerCase().includes(query) ||
          box.category.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory !== "All") {
      boxes = boxes.filter((box) => box.category === selectedCategory);
    }

    // Sort boxes
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
  }, [selectedCategory, sortOption, searchQuery]);

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
          {/* App Header */}
          <AppHeader 
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
          />

          {/* Box Grid Section */}
          <section className="py-12" id="boxes">
            <div className="container mx-auto px-4">
              <FilterBar
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                sortOption={sortOption}
                onSortChange={setSortOption}
              />

              {/* Results count */}
              <div className="mt-6 mb-4 text-sm text-muted-foreground">
                {filteredBoxes.length} {filteredBoxes.length === 1 ? 'box trouvée' : 'box trouvées'}
                {searchQuery && ` pour "${searchQuery}"`}
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredBoxes.length > 0 ? (
                  filteredBoxes.map((box, index) => (
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
                  ))
                ) : (
                  <div className="col-span-full text-center py-16">
                    <p className="text-muted-foreground text-lg mb-4">
                      Aucune box ne correspond à vos critères
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Essayez de modifier vos filtres ou votre recherche
                    </p>
                  </div>
                )}
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
