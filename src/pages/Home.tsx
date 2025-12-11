import { Helmet } from "react-helmet";
import { ArrowRight, Sparkles, Leaf, Heart, Recycle, ShoppingBag, Star, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>ReStyle - Mode Seconde Main Éco-Responsable</title>
        <meta
          name="description"
          content="Découvrez des box de vêtements de seconde main sélectionnées par notre IA styliste. Mode unique, éco-responsable et adaptée à votre personnalité."
        />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Navbar cartCount={0} />

        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative overflow-hidden gradient-hero py-20 md:py-32">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" />
              <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float delay-300" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left Content */}
                <div className="space-y-8 animate-slide-up">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent rounded-full text-sm font-medium text-accent-foreground">
                    <Leaf className="h-4 w-4" />
                    <span>Mode Circulaire & Durable</span>
                  </div>

                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight">
                    Votre Style,{" "}
                    <span className="text-primary">Réinventé</span>
                    <br />
                    pour la Planète
                  </h1>

                  <p className="text-lg text-muted-foreground max-w-lg">
                    Découvrez des box de vêtements de seconde main soigneusement sélectionnées 
                    par notre IA styliste. Mode unique, éco-responsable et adaptée à votre personnalité.
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <Link to="/catalog">
                      <Button variant="hero" size="xl">
                        Découvrir les box
                        <ArrowRight className="h-5 w-5 ml-2" />
                      </Button>
                    </Link>
                    <Link to="/style-assistant">
                      <Button variant="outline" size="xl">
                        <Sparkles className="h-5 w-5 mr-2" />
                        Assistant IA
                      </Button>
                    </Link>
                  </div>

                  {/* Stats */}
                  <div className="flex flex-wrap gap-8 pt-4">
                    {[
                      { icon: Recycle, value: "50K+", label: "Vêtements sauvés" },
                      { icon: Heart, value: "12K+", label: "Clients satisfaits" },
                      { icon: Leaf, value: "30T", label: "CO₂ économisé" },
                    ].map((stat, index) => (
                      <div 
                        key={index} 
                        className="flex items-center gap-3 animate-fade-in"
                        style={{ animationDelay: `${(index + 1) * 200}ms` }}
                      >
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <stat.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-xl font-bold text-foreground">{stat.value}</p>
                          <p className="text-sm text-muted-foreground">{stat.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Content - Image Grid */}
                <div className="relative hidden lg:block">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div className="rounded-2xl overflow-hidden shadow-elevated animate-fade-in delay-100">
                        <img
                          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=500&fit=crop"
                          alt="Fashion"
                          className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="rounded-2xl overflow-hidden shadow-card animate-fade-in delay-300">
                        <img
                          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop"
                          alt="Vintage"
                          className="w-full h-40 object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </div>
                    <div className="space-y-4 pt-8">
                      <div className="rounded-2xl overflow-hidden shadow-card animate-fade-in delay-200">
                        <img
                          src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=300&fit=crop"
                          alt="Style"
                          className="w-full h-40 object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="rounded-2xl overflow-hidden shadow-elevated animate-fade-in delay-400">
                        <img
                          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=500&fit=crop"
                          alt="Sustainable"
                          className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-20 bg-card">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                  Pourquoi ReStyle ?
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Une nouvelle façon de consommer la mode, plus responsable et personnalisée
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  {
                    icon: Sparkles,
                    title: "IA Personnalisée",
                    description: "Notre assistant IA analyse votre style pour vous proposer des box parfaitement adaptées",
                    color: "text-primary"
                  },
                  {
                    icon: Leaf,
                    title: "Éco-Responsable",
                    description: "Chaque achat réduit les déchets textiles et préserve les ressources naturelles",
                    color: "text-green-500"
                  },
                  {
                    icon: Star,
                    title: "Qualité Premium",
                    description: "Vêtements de seconde main soigneusement sélectionnés pour leur qualité et leur style",
                    color: "text-yellow-500"
                  },
                  {
                    icon: TrendingUp,
                    title: "Prix Justes",
                    description: "Jusqu'à 70% moins cher que le neuf pour des pièces uniques et tendance",
                    color: "text-blue-500"
                  }
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="p-6 bg-background rounded-2xl shadow-card hover:shadow-elevated transition-all duration-300 animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`p-3 bg-primary/10 rounded-xl w-fit mb-4 ${feature.color}`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-display font-semibold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 gradient-hero">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center space-y-8">
                <Badge variant="secondary" className="text-sm px-4 py-2">
                  <ShoppingBag className="h-4 w-4 mr-2 inline" />
                  24 Box Disponibles
                </Badge>
                
                <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground">
                  Prêt(e) à transformer votre garde-robe ?
                </h2>
                
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Rejoignez des milliers de fashion lovers qui ont déjà adopté 
                  une mode plus responsable et personnalisée
                </p>

                <div className="flex flex-wrap justify-center gap-4 pt-4">
                  <Link to="/catalog">
                    <Button variant="hero" size="xl">
                      Explorer le catalogue
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                  </Link>
                  <Link to="/style-assistant">
                    <Button variant="outline" size="xl">
                      <Sparkles className="h-5 w-5 mr-2" />
                      Parler à l'assistant
                    </Button>
                  </Link>
                </div>

                {/* Trust indicators */}
                <div className="flex flex-wrap justify-center gap-8 pt-8 text-sm">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-foreground font-medium">4.8/5</span>
                    <span className="text-muted-foreground">(2,450 avis)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-green-500" />
                    <span className="text-foreground font-medium">50K+</span>
                    <span className="text-muted-foreground">articles sauvés</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 text-primary" />
                    <span className="text-foreground font-medium">Livraison offerte</span>
                    <span className="text-muted-foreground">dès 50€</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Impact Section */}
          <section className="py-20">
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
                  Chaque vêtement que vous choisissez contribue à un futur plus durable
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
                    className="text-center p-8 bg-card rounded-2xl shadow-card animate-slide-up hover:shadow-elevated transition-all duration-300"
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
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Home;
