import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-foreground text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-white p-1 rounded-lg">
                <img src="/logo.png" alt="AGS Ciudadana" className="h-10 w-auto" />
              </div>
              <span className="font-display font-bold text-2xl tracking-tight">
                AGS Ciudadana
              </span>
            </div>
            <p className="text-gray-400 max-w-md mb-6">
              Empoderando a los ciudadanos de Aguascalientes para construir una ciudad mejor, un reporte a la vez.
            </p>
            <div className="flex gap-4">
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-primary hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-primary hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-primary hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-display font-bold text-lg mb-4 text-secondary">Enlaces</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Inicio</a></li>
              <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Características</a></li>
              <li><a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">Cómo Funciona</a></li>
              <li><a href="#download" className="text-gray-400 hover:text-white transition-colors">Descargar App</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-bold text-lg mb-4 text-secondary">Legal</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacidad</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Términos de Uso</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contacto</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} AGS Ciudadana. Todos los derechos reservados.
          </p>
          <p className="text-gray-500 text-sm">
            Desarrollado por Juan Carlos González Macías y Aaron Salvador Castañeda Ruiz
          </p>
        </div>
      </div>
    </footer>
  );
}
