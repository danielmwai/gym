import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/hooks/useCart";
import { Link } from "wouter";
import type { Product } from "@shared/schema";

export default function ShopSection() {
  const { addItem } = useCart();
  
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products?featured=true"],
  });

  const defaultProducts = [
    {
      id: "1",
      name: "FeminaFit Sports Bra",
      description: "High-support, moisture-wicking sports bra",
      price: "2500",
      imageUrl: "https://images.unsplash.com/photo-1506629905607-45848c21bc27?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
    },
    {
      id: "2", 
      name: "Protein Powder",
      description: "Plant-based protein for women",
      price: "3800",
      imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
    },
    {
      id: "3",
      name: "Resistance Bands Set",
      description: "Complete resistance training kit", 
      price: "1800",
      imageUrl: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
    },
    {
      id: "4",
      name: "Recovery Oil Set",
      description: "Aromatherapy oils for muscle recovery",
      price: "2200", 
      imageUrl: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
    }
  ];

  const displayProducts = products && products.length > 0 ? products : defaultProducts;

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      imageUrl: product.imageUrl,
    });
  };

  return (
    <section id="shop" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4" data-testid="text-shop-title">
            FeminaFit Shop
          </h2>
          <p className="text-xl text-muted-foreground" data-testid="text-shop-subtitle">
            Premium fitness gear and wellness products for the modern woman
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <Skeleton className="w-full h-48" />
                <CardContent className="p-4">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-3" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            displayProducts.map((product, index) => (
              <Card 
                key={product.id} 
                className="overflow-hidden group hover:shadow-xl smooth-transition"
                data-testid={`card-product-${index}`}
              >
                <img 
                  src={product.imageUrl || "https://images.unsplash.com/photo-1506629905607-45848c21bc27?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200"} 
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 smooth-transition" 
                  data-testid={`img-product-${index}`}
                />
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold text-foreground mb-2" data-testid={`text-product-name-${index}`}>
                    {product.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-3" data-testid={`text-product-description-${index}`}>
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-primary" data-testid={`text-product-price-${index}`}>
                      KES {product.price}
                    </span>
                    <Button 
                      size="sm"
                      onClick={() => handleAddToCart(product)}
                      data-testid={`button-add-to-cart-${index}`}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
        
        <div className="text-center mt-12">
          <Button 
            variant="secondary"
            size="lg"
            asChild
            data-testid="button-view-all-products"
          >
            <Link href="/shop">View All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
