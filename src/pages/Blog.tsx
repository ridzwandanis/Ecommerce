import Header from "@/components/Header";
import MobileHeader from "@/components/MobileHeader";
import BottomNav from "@/components/BottomNav";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, User, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "@/lib/api";
import { format } from "date-fns";

const Blog = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  return (
    <div className="min-h-screen bg-background flex flex-col pb-16 md:pb-0">
      <Header />
      <MobileHeader />

      <main className="flex-grow container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Jurnal & Berita</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Inspirasi gaya, tips perawatan, dan berita terbaru dari dunia fashion.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-3">
                 <Skeleton className="aspect-[4/3] rounded-xl w-full" />
                 <Skeleton className="h-4 w-3/4" />
                 <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : posts?.length === 0 ? (
           <div className="text-center py-20 text-muted-foreground">
             Belum ada artikel yang diterbitkan.
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts?.map((post) => (
              <Link to={`/blog/${post.id}`} key={post.id} className="group block h-full">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                  <img 
                    src={post.image || "https://via.placeholder.com/800x600?text=No+Image"} 
                    alt={post.title} 
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Category Badge */}
                  {post.category && (
                    <div className="absolute top-3 left-3 z-10">
                      <span className="bg-background/90 backdrop-blur-sm text-foreground px-2 py-1 rounded-md text-[10px] font-medium shadow-sm">
                        {post.category}
                      </span>
                    </div>
                  )}

                  {/* Floating Action Button */}
                  <Button
                    size="icon"
                    className="absolute bottom-3 right-3 opacity-100 md:opacity-0 md:translate-y-4 transition-all duration-300 md:group-hover:opacity-100 md:group-hover:translate-y-0 bg-white/90 backdrop-blur-sm text-gray-900 hover:bg-white hover:text-primary shadow-sm hover:shadow-md z-20 h-9 w-9 rounded-full border border-gray-100"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(post.createdAt), "dd MMM yyyy")}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {post.author || "Admin"}
                    </div>
                  </div>
                  
                  <h2 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {post.excerpt || post.content.substring(0, 100)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      
      <Footer />
      <BottomNav />
    </div>
  );
};

export default Blog;
