import { Button } from "@/components/ui/button";
import { ArrowRight, Download } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-accent/30 pt-20 pb-32 border-b-2 border-foreground">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" 
           style={{ backgroundImage: 'radial-gradient(#1E293B 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-foreground rounded-full shadow-hard-sm">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-sm font-bold text-foreground">v1.4.3 Disponible Ahora</span>
            </div>
            
            <h1 className="font-display font-bold text-5xl md:text-7xl leading-[0.9] tracking-tight text-foreground">
              Tu voz construye <br/>
              <span className="text-primary relative inline-block">
                una mejor ciudad
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-secondary -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
              Reporta baches, fallas de alumbrado y fugas de agua en segundos. Conecta directamente con las autoridades y sigue el progreso de tus reportes.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a href="#download">
                <Button className="h-14 px-8 text-lg bg-primary text-white hover:bg-primary/90 border-2 border-foreground shadow-hard btn-press rounded-xl gap-2 w-full sm:w-auto">
                  <Download size={20} />
                  Descargar App
                </Button>
              </a>
              <a href="#features">
                <Button variant="outline" className="h-14 px-8 text-lg bg-white hover:bg-gray-50 border-2 border-foreground shadow-hard btn-press rounded-xl gap-2 w-full sm:w-auto">
                  Saber más
                  <ArrowRight size={20} />
                </Button>
              </a>
            </div>
            
            <div className="flex items-center gap-4 pt-4 text-sm font-medium text-muted-foreground">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="User" />
                  </div>
                ))}
              </div>
              <p>+2,000 ciudadanos activos</p>
            </div>
          </div>
          
          <div className="relative lg:h-[600px] flex items-center justify-center">
            {/* Abstract shapes */}
            <div className="absolute top-10 right-10 w-64 h-64 bg-secondary rounded-full blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-10 left-10 w-64 h-64 bg-primary rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
            
            {/* Phone Mockup */}
            <div className="relative z-10 w-[300px] h-[600px] bg-foreground rounded-[3rem] border-[8px] border-foreground shadow-2xl overflow-hidden transform rotate-[-6deg] hover:rotate-0 transition-transform duration-500">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-foreground rounded-b-xl z-20"></div>
              <div className="w-full h-full bg-white overflow-hidden relative">
                {/* Mock UI Header */}
                <div className="h-20 bg-white border-b border-gray-100 flex items-end pb-3 px-4 justify-between">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">J</div>
                  <div className="font-bold text-gray-900">AGS Ciudadana</div>
                  <div className="w-8 h-8"></div>
                </div>
                
                {/* Mock Map */}
                <div className="h-48 bg-gray-100 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-80" style={{ backgroundImage: 'url(/map-ags.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center animate-ping"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-primary border-2 border-white rounded-full shadow-lg"></div>
                </div>
                
                {/* Mock Reports List */}
                <div className="p-4 space-y-3">
                  <div className="font-bold text-gray-800 mb-2">Reportes Recientes</div>
                  {[
                    { title: 'Bache en Av. Universidad', color: 'bg-red-100 text-red-600', status: 'Pendiente' },
                    { title: 'Lámpara fundida', color: 'bg-yellow-100 text-yellow-600', status: 'En Proceso' },
                    { title: 'Fuga de agua', color: 'bg-blue-100 text-blue-600', status: 'Resuelto' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl shadow-sm bg-white">
                      <div className={`w-10 h-10 rounded-lg ${item.color} flex items-center justify-center`}>
                        <div className="w-5 h-5 bg-current opacity-20 rounded-sm"></div>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-gray-900">{item.title}</div>
                        <div className="text-xs text-gray-500">{item.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Floating Action Button */}
                <div className="absolute bottom-6 right-6 w-14 h-14 bg-secondary text-secondary-foreground rounded-full shadow-lg flex items-center justify-center border-2 border-foreground">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute top-1/4 -right-4 bg-white p-4 rounded-xl border-2 border-foreground shadow-hard rotate-6 z-20 animate-bounce" style={{ animationDuration: '3s' }}>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-bold text-sm">¡Reporte Resuelto!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
