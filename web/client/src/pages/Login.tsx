import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      toast.success("¡Bienvenido de nuevo!");
      setLocation("/");
    } else {
      toast.error(result.error || "Error al iniciar sesión");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Left Side - Form */}
      <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center relative">
        <Link href="/">
          <Button variant="ghost" className="absolute top-8 left-8 gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft size={20} />
            Volver al inicio
          </Button>
        </Link>

        <div className="max-w-md mx-auto w-full">
          <div className="mb-8 text-center md:text-left">
            <img src="/logo.png" alt="AGS Ciudadana" className="h-12 w-auto mb-6 mx-auto md:mx-0" />
            <h1 className="font-display font-bold text-3xl md:text-4xl mb-2">Iniciar Sesión</h1>
            <p className="text-muted-foreground">Ingresa a tu cuenta para gestionar tus reportes.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="tu@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 border-2 border-input focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Contraseña</Label>
                <a href="#" className="text-sm font-medium text-primary hover:underline">¿Olvidaste tu contraseña?</a>
              </div>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 border-2 border-input focus:border-primary"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-lg font-bold bg-primary text-white hover:bg-primary/90 border-2 border-foreground shadow-hard btn-press rounded-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Iniciando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-muted-foreground">
              ¿No tienes una cuenta?{" "}
              <Link href="/register">
                <span className="font-bold text-primary hover:underline cursor-pointer">Regístrate aquí</span>
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image/Decoration */}
      <div className="hidden md:block w-1/2 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" 
             style={{ backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)', backgroundSize: '32px 32px' }}>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="relative w-full max-w-md aspect-[9/16] bg-foreground rounded-[3rem] border-[8px] border-foreground shadow-2xl overflow-hidden transform rotate-[-6deg]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-foreground rounded-b-xl z-20"></div>
            <div className="w-full h-full bg-white flex flex-col items-center justify-center p-8 text-center">
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-6 animate-bounce">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary-foreground">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
              </div>
              <h3 className="font-display font-bold text-2xl mb-2">Tu reporte hace la diferencia</h3>
              <p className="text-gray-500">Únete a la comunidad y ayuda a mantener nuestra ciudad en perfectas condiciones.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
