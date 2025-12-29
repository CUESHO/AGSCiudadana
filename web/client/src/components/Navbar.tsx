import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="border-b-2 border-foreground bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-3 cursor-pointer">
            <img src="/logo.png" alt="AGS Ciudadana" className="h-10 w-auto" />
            <span className="font-display font-bold text-xl tracking-tight text-primary hidden sm:block">
              AGS Ciudadana
            </span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="font-medium hover:text-primary transition-colors">Características</a>
          <a href="#how-it-works" className="font-medium hover:text-primary transition-colors">Cómo Funciona</a>
          <a href="#download" className="font-medium hover:text-primary transition-colors">Descargar</a>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="font-bold hover:bg-accent hover:text-accent-foreground flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary border border-primary/20">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span className="text-sm">{user.name.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <span className="hidden sm:inline">{user.name.split(' ')[0]}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 border-2 border-foreground shadow-hard rounded-xl">
                <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => logout()} className="cursor-pointer text-red-600 focus:text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button variant="ghost" className="font-bold hover:bg-accent hover:text-accent-foreground hidden sm:flex">
                Iniciar Sesión
              </Button>
            </Link>
          )}
          
          <a href="#download">
            <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold border-2 border-foreground shadow-hard btn-press rounded-lg">
              Reportar Ahora
            </Button>
          </a>
        </div>
      </div>
    </nav>
  );
}
