import { AlertTriangle, Lightbulb, Droplets, Trash2, ShieldAlert, MapPin, Camera, Bell } from "lucide-react";

const features = [
  {
    icon: MapPin,
    title: "Ubicación Exacta",
    description: "Geolocalización automática para que las cuadrillas sepan exactamente dónde está el problema.",
    color: "bg-blue-100 text-blue-600"
  },
  {
    icon: Camera,
    title: "Evidencia Fotográfica",
    description: "Adjunta fotos directamente desde tu cámara o galería para dar contexto visual al reporte.",
    color: "bg-purple-100 text-purple-600"
  },
  {
    icon: Bell,
    title: "Notificaciones Real-time",
    description: "Recibe actualizaciones instantáneas cuando tu reporte cambie de estado a 'En Proceso' o 'Resuelto'.",
    color: "bg-yellow-100 text-yellow-600"
  }
];

const categories = [
  { id: 'bache', name: 'Baches', icon: AlertTriangle, color: 'bg-red-100 text-red-600' },
  { id: 'alumbrado', name: 'Alumbrado', icon: Lightbulb, color: 'bg-yellow-100 text-yellow-600' },
  { id: 'fuga', name: 'Fugas', icon: Droplets, color: 'bg-blue-100 text-blue-600' },
  { id: 'basura', name: 'Basura', icon: Trash2, color: 'bg-green-100 text-green-600' },
  { id: 'seguridad', name: 'Seguridad', icon: ShieldAlert, color: 'bg-purple-100 text-purple-600' },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display font-bold text-4xl md:text-5xl mb-6 text-foreground">
            Todo lo que necesitas para <br/>
            <span className="text-primary">mejorar tu entorno</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Una herramienta potente diseñada para simplificar la comunicación entre ciudadanos y gobierno.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {features.map((feature, index) => (
            <div key={index} className="group p-8 rounded-2xl border-2 border-foreground bg-white shadow-hard hover:translate-y-[-4px] hover:shadow-lg transition-all duration-300">
              <div className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mb-6 border-2 border-foreground group-hover:scale-110 transition-transform`}>
                <feature.icon size={28} strokeWidth={2.5} />
              </div>
              <h3 className="font-display font-bold text-2xl mb-3 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-muted rounded-3xl p-8 md:p-12 border-2 border-foreground relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <h3 className="font-display font-bold text-3xl md:text-4xl mb-6">
                Reporta cualquier incidencia
              </h3>
              <p className="text-lg text-muted-foreground mb-8">
                Hemos categorizado los problemas más comunes para agilizar la atención. Selecciona la categoría, toma una foto y listo.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                {categories.map((cat) => (
                  <div key={cat.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className={`w-10 h-10 rounded-lg ${cat.color} flex items-center justify-center flex-shrink-0`}>
                      <cat.icon size={20} />
                    </div>
                    <span className="font-bold text-gray-800">{cat.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-white border-2 border-foreground shadow-hard overflow-hidden flex items-center justify-center p-8">
                <div className="grid grid-cols-2 gap-4 w-full h-full">
                  <div className="bg-red-50 rounded-xl p-4 flex flex-col items-center justify-center text-center border border-red-100">
                    <AlertTriangle size={40} className="text-red-500 mb-2" />
                    <span className="font-bold text-red-900">Baches</span>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4 flex flex-col items-center justify-center text-center border border-blue-100">
                    <Droplets size={40} className="text-blue-500 mb-2" />
                    <span className="font-bold text-blue-900">Fugas</span>
                  </div>
                  <div className="bg-yellow-50 rounded-xl p-4 flex flex-col items-center justify-center text-center border border-yellow-100">
                    <Lightbulb size={40} className="text-yellow-500 mb-2" />
                    <span className="font-bold text-yellow-900">Alumbrado</span>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4 flex flex-col items-center justify-center text-center border border-green-100">
                    <Trash2 size={40} className="text-green-500 mb-2" />
                    <span className="font-bold text-green-900">Basura</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
