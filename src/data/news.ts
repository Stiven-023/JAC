export interface NewsItem {
    id: string;
    title: string;
    date: string;
    description: string;
    fullContent: string;
}

export const newsData: NewsItem[] = [
    {
        id: "1",
        title: "Jornada de limpieza",
        date: "2024-07-01",
        description: "Este sabado realizaremos una jornada de limpieza en el parque",
        fullContent: `Este sábado realizaremos una jornada de limpieza en el parque principal de nuestro conjunto residencial. 

La actividad comenzará a las 8:00 a.m. y se extenderá hasta las 12:00 p.m. Invitamos a todos los residentes a participar activamente en esta iniciativa comunitaria.

**Materiales que necesitaremos:**
- Guantes de trabajo
- Bolsas para reciclaje
- Herramientas de jardinería (si las tienen disponibles)

**Actividades a realizar:**
- Recolección de basura y residuos
- Limpieza de áreas verdes
- Mantenimiento de jardines
- Organización de espacios comunes

Al finalizar la jornada, compartiremos un refrigerio para todos los participantes. Esta es una excelente oportunidad para fortalecer los lazos comunitarios y mantener nuestro conjunto residencial en óptimas condiciones.

Por favor, confirme su asistencia antes del viernes para poder organizar mejor los grupos de trabajo.`
    },
    {
        id: "2",
        title: "Actualización del reglamento interno",
        date: "2024-07-01",
        description: "Descripción del evento 1",
        fullContent: `La Junta de Acción Comunal ha aprobado una actualización importante del reglamento interno de nuestro conjunto residencial.

**Principales cambios:**

1. **Horarios de uso de zonas comunes:** Se han establecido horarios específicos para el uso de la piscina, salón comunal y áreas deportivas.

2. **Política de mascotas:** Se actualizaron las normas sobre el cuidado y responsabilidad de las mascotas en áreas comunes.

3. **Gestión de residuos:** Nuevas directrices para la separación y disposición de basuras, incluyendo días específicos para recolección de reciclables.

4. **Uso de parqueaderos:** Se implementaron nuevas reglas para el uso de espacios de estacionamiento y visitantes.

El reglamento completo estará disponible en la oficina de administración y en el portal web de la JAC. Todos los residentes deben revisar estos cambios y cumplir con las nuevas normativas a partir del próximo mes.

Si tiene alguna pregunta o sugerencia sobre estos cambios, puede contactarnos a través del canal de sugerencias.`
    },
    {
        id: "3",
        title: "Nuevo servicio de reciclaje puerta a puerta",
        date: "2024-07-01",
        description: "Descripción del evento 1",
        fullContent: `Estamos emocionados de anunciar el nuevo servicio de reciclaje puerta a puerta que estará disponible a partir del próximo mes.

**¿Cómo funciona?**

El servicio operará los días martes y viernes de cada semana. Los residentes deberán separar sus residuos reciclables en bolsas transparentes y dejarlas en la puerta de su apartamento antes de las 7:00 a.m.

**Materiales que se reciclarán:**
- Plásticos (botellas, envases)
- Papel y cartón
- Vidrio
- Metales (latas de aluminio, envases metálicos)

**Beneficios:**
- Contribución al cuidado del medio ambiente
- Reducción de residuos en el conjunto
- Posibilidad de obtener beneficios por puntos de reciclaje

**Inscripción:**
Para participar en este programa, debe inscribirse en la oficina de administración o a través del portal web. El servicio es completamente gratuito para todos los residentes.

Este es un paso importante hacia un conjunto residencial más sostenible y responsable con el medio ambiente.`
    },
    {
        id: "4",
        title: "Convocatoria a reunion mensual",
        date: "2024-07-01",
        description: "Descripción del evento 1",
        fullContent: `Convocamos a todos los residentes a la reunión mensual de la Junta de Acción Comunal que se llevará a cabo el próximo sábado.

**Fecha:** Sábado, 15 de julio de 2024
**Hora:** 3:00 p.m.
**Lugar:** Salón comunal

**Orden del día:**

1. Aprobación del acta de la reunión anterior
2. Presentación de informe financiero del mes
3. Discusión sobre proyectos en curso
4. Propuestas de nuevos proyectos comunitarios
5. Espacio para preguntas y sugerencias de los residentes

**Temas importantes a tratar:**
- Presupuesto para mejoras en áreas comunes
- Plan de mantenimiento de la piscina
- Actualización del sistema de seguridad
- Propuestas para actividades comunitarias

Su participación es fundamental para el buen funcionamiento de nuestra comunidad. Esperamos contar con su presencia y aportes valiosos.

Si tiene algún tema que desee incluir en el orden del día, por favor comuníquelo con al menos 48 horas de anticipación.`
    }
];

export function getNewsById(id: string): NewsItem | undefined {
    return newsData.find(news => news.id === id);
}

