# Proyecto Junta de Acción Comunal (JAC)

Este repositorio contiene el desarrollo técnico y documental del proyecto **Junta de Acción Comunal (JAC)**.  
Su propósito es fortalecer la **gestión comunitaria, la participación ciudadana y la comunicación** entre los miembros de la comunidad y su Junta.

---

## Objetivo General

Diseñar y desarrollar una **plataforma digital** que permita mejorar la **organización, transparencia y comunicación** dentro de una Junta de Acción Comunal, integrando herramientas tecnológicas accesibles para sus integrantes y toda la comunidad.

---

## Objetivos Específicos

- Facilitar el registro y administración de miembros de la JAC.  
- Digitalizar los procesos de reuniones, actas y decisiones comunales.  
- Promover la participación ciudadana mediante una interfaz sencilla y accesible.  
- Visualizar fácilmente eventos importantes en la comunidad.  
- Permitir expresar quejas y reclamos de forma directa con la administración.  
- Fortalecer la visibilidad de la JAC ante la comunidad local.

---

## Integrantes del Proyecto

- **Daniel Getial Pulgarín**  
- **Valentina Sánchez Rosero**  
- **Stiven Castro Sánchez**  
- **Andrés Felipe Aristizábal Buriticá**  
- **Jhonier Alberto Ipia Noscue**

---

## Estructura del Proyecto

proyecto-jac/
│
├── .env.example           → Ejemplo de como deberian de ir las variables de entorno para que funcione correctamente (claves de Supabase).
├── docs/                  → Documentos oficiales (estatutos, actas, reglamentos).
├── public/                → Recursos públicos (imágenes, logos, favicon).
├── src/                   → CÓDIGO FUENTE DE LA APLICACIÓN
│   ├── app/               → Rutas de Next.js (páginas, layouts, etc.)
│   │   ├── (auth)/        → Rutas de autenticación (login, registro).
│   │   │   ├── login/
│   │   │   └── registro/  → Contiene la UI de registro.
│   │   └── home/          → Dashboard principal (requiere autenticación).
│   │
│   └── lib/               → Lógica central y de conexión (Backend)
│       └── autenticacion.ts → **Lógica de autenticación, Server Actions y Rollback de Supabase.**
│
├── data/                  → Archivos de datos de configuración o iniciales (JSON, CSV).
└── README.md              → Descripción general del proyecto (este archivo).



---

## Estado Actual del Proyecto

- [x] Creación del repositorio en GitHub  
- [x] Configuración de identidad en Git  
- [x] Organización de estructura de carpetas  
- [x] Documentación técnica inicial  
- [x] Desarrollo del prototipo funcional  
- [x] Implementación de base de datos  
- [ ] Pruebas y despliegue  