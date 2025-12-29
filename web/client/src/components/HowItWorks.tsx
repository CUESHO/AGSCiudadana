import { CheckCircle2 } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Descarga y Regístrate",
    description: "Instala la app en tu dispositivo Android y crea tu cuenta en segundos con tu correo electrónico."
  },
  {
    number: "02",
    title: "Crea un Reporte",
    description: "Selecciona la categoría, toma una foto del problema y confirma tu ubicación en el mapa."
  },
  {
    number: "03",
    title: "Seguimiento",
    description: "Recibe notificaciones cuando tu reporte sea atendido y resuelto por las cuadrillas municipales."
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-background border-y-2 border-foreground">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-16 items-start">
          <div className="md:w-1/3 sticky top-24">
            <h2 className="font-display font-bold text-4xl md:text-5xl mb-6 text-foreground">
              Tan fácil como <br/>
              <span className="text-secondary-foreground bg-secondary px-2">1, 2, 3</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Hemos simplificado el proceso para que reportar tome menos de un minuto. Sin filas, sin llamadas, sin burocracia.
            </p>
            <div className="p-6 bg-white rounded-xl border-2 border-foreground shadow-hard-sm">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 className="text-green-500" />
                <span className="font-bold">Gratis para todos</span>
              </div>
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 className="text-green-500" />
                <span className="font-bold">Disponible 24/7</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-green-500" />
                <span className="font-bold">Respuesta garantizada</span>
              </div>
            </div>
          </div>

          <div className="md:w-2/3 space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-6 md:gap-10 group">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-primary text-white rounded-2xl border-2 border-foreground shadow-hard flex items-center justify-center font-display font-bold text-3xl md:text-4xl group-hover:scale-110 transition-transform duration-300">
                    {step.number}
                  </div>
                  {index !== steps.length - 1 && (
                    <div className="w-0.5 h-full bg-gray-300 mx-auto mt-4 dashed-line"></div>
                  )}
                </div>
                <div className="pt-2 pb-12">
                  <h3 className="font-display font-bold text-2xl md:text-3xl mb-4 text-foreground">{step.title}</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
