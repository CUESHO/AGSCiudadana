import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup } = useAuth();
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setIsSubmitting(true);
    const result = await signup(name, email, password);
    setIsSubmitting(false);

    if (result.success) {
      toast.success("¡Cuenta creada! Por favor verifica tu correo.");
      setLocation("/verify-email");
    } else {
      toast.error(result.error || "Error al crear la cuenta");
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

        <div className="max-w-md mx-auto w-full pt-12 md:pt-0">
          <div className="mb-8 text-center md:text-left">
            <img src="/logo.png" alt="AGS Ciudadana" className="h-12 w-auto mb-6 mx-auto md:mx-0" />
            <h1 className="font-display font-bold text-3xl md:text-4xl mb-2">Crear Cuenta</h1>
            <p className="text-muted-foreground">Únete hoy y comienza a mejorar tu ciudad.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre Completo</Label>
              <Input 
                id="name" 
                type="text" 
                placeholder="Juan Pérez" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 border-2 border-input focus:border-primary"
              />
            </div>

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
              <Label htmlFor="password">Contraseña</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 border-2 border-input focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
              <Input 
                id="confirmPassword" 
                type="password" 
                placeholder="••••••••" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-12 border-2 border-input focus:border-primary"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-lg font-bold bg-secondary text-secondary-foreground hover:bg-secondary/90 border-2 border-foreground shadow-hard btn-press rounded-lg mt-4"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creando cuenta...
                </>
              ) : (
                "Registrarse"
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-muted-foreground">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/login">
                <span className="font-bold text-primary hover:underline cursor-pointer">Inicia sesión aquí</span>
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image/Decoration */}
      <div className="hidden md:block w-1/2 bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" 
             style={{ backgroundImage: 'radial-gradient(#000000 2px, transparent 2px)', backgroundSize: '32px 32px' }}>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="relative w-full max-w-md aspect-[9/16] bg-foreground rounded-[3rem] border-[8px] border-foreground shadow-2xl overflow-hidden transform rotate-[6deg]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-foreground rounded-b-xl z-20"></div>
            <div className="w-full h-full bg-white flex flex-col items-center justify-center p-8 text-center">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mb-6 animate-pulse">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h3 className="font-display font-bold text-2xl mb-2">Seguridad y Confianza</h3>
              <p className="text-gray-500">Tus datos están protegidos. Úsalos para reportar incidencias de forma segura y oficial.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
