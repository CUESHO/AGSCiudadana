import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Mail, ArrowRight, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Link } from "wouter";
import { auth } from "@/lib/firebase";

export default function VerifyEmail() {
  const { user, resendVerificationEmail, logout } = useAuth();
  const [sending, setSending] = useState(false);

  const handleResend = async () => {
    setSending(true);
    const result = await resendVerificationEmail();
    setSending(false);
    
    if (result.success) {
      toast.success("Correo de verificación reenviado");
    } else {
      toast.error(result.error || "Error al reenviar correo");
    }
  };

  const checkVerification = async () => {
    await auth.currentUser?.reload();
    if (auth.currentUser?.emailVerified) {
      window.location.href = "/";
    } else {
      toast.info("Aún no se ha verificado el correo. Por favor revisa tu bandeja de entrada.");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Acceso Denegado</h1>
          <Link href="/login">
            <Button>Ir a Iniciar Sesión</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border-2 border-foreground shadow-hard text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail size={40} className="text-primary" />
        </div>
        
        <h1 className="font-display font-bold text-2xl mb-2">Verifica tu correo</h1>
        <p className="text-muted-foreground mb-6">
          Hemos enviado un enlace de confirmación a <strong>{user.email}</strong>. 
          Por favor verifica tu cuenta para acceder a la descarga.
        </p>

        <div className="space-y-3">
          <Button 
            onClick={checkVerification} 
            className="w-full h-12 font-bold bg-primary text-white hover:bg-primary/90 border-2 border-foreground shadow-hard-sm btn-press rounded-lg"
          >
            Ya verifiqué mi correo
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <Button 
            variant="outline" 
            onClick={handleResend} 
            disabled={sending}
            className="w-full h-12 font-bold border-2 border-foreground shadow-hard-sm btn-press rounded-lg"
          >
            {sending ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Reenviar correo
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={() => logout()}
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </div>
  );
}
