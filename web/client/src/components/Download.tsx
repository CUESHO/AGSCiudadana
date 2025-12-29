import { Button } from "@/components/ui/button";
import { Download, Smartphone, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "wouter";
import { auth } from "@/lib/firebase";

export default function DownloadSection() {
  const { user } = useAuth();
  const isVerified = user && auth.currentUser?.emailVerified;

  return (
    <section id="download" className="py-24 bg-primary relative overflow-hidden text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10" 
           style={{ backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)', backgroundSize: '32px 32px' }}>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto bg-white text-foreground rounded-3xl p-8 md:p-16 border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] text-center">
          <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-foreground shadow-hard-sm animate-bounce">
            <Smartphone size={40} className="text-secondary-foreground" />
          </div>
          
          <h2 className="font-display font-bold text-4xl md:text-5xl mb-6">
            ¿Listo para hacer la diferencia?
          </h2>
          
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Únete a miles de ciudadanos que ya están mejorando Aguascalientes. Descarga la app hoy mismo y comienza a reportar.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {isVerified ? (
              <a href="/app-debug.apk" download>
                <Button className="h-16 px-8 text-lg bg-foreground text-white hover:bg-foreground/90 border-2 border-foreground shadow-hard btn-press rounded-xl gap-3 w-full sm:w-auto">
                  <Download size={24} />
                  <div className="text-left">
                    <div className="text-xs font-normal opacity-80">Descargar APK para</div>
                    <div className="font-bold leading-none">Android</div>
                  </div>
                </Button>
              </a>
            ) : (
              <Link href={user ? "/verify-email" : "/register"}>
                <Button className="h-16 px-8 text-lg bg-foreground text-white hover:bg-foreground/90 border-2 border-foreground shadow-hard btn-press rounded-xl gap-3 w-full sm:w-auto">
                  <Lock size={24} />
                  <div className="text-left">
                    <div className="text-xs font-normal opacity-80">Regístrate para</div>
                    <div className="font-bold leading-none">Descargar</div>
                  </div>
                </Button>
              </Link>
            )}
            
            <Button variant="outline" className="h-16 px-8 text-lg bg-white hover:bg-gray-50 border-2 border-foreground shadow-hard btn-press rounded-xl gap-3 w-full sm:w-auto opacity-50 cursor-not-allowed">
              <div className="text-left">
                <div className="text-xs font-normal opacity-80">Próximamente en</div>
                <div className="font-bold leading-none">iOS Store</div>
              </div>
            </Button>
          </div>
          
          <p className="mt-8 text-sm text-muted-foreground">
            Requiere Android 8.0 o superior. Versión actual 1.4.3
          </p>
        </div>
      </div>
    </section>
  );
}
