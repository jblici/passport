# Button System - Variantes

## Variantes Disponibles

### Primary (Defecto)
Botón principal para acciones primarias. Usa color azul.
```jsx
<Button variant="primary" size="default">Buscar</Button>
<Button variant="primary" size="sm">Agregar</Button>
<Button variant="primary" size="lg">Guardar Presupuesto</Button>
```

### Secondary
Botón secundario para acciones alternativas. Usa color gris.
```jsx
<Button variant="secondary">Cancelar</Button>
<Button variant="secondary" size="sm">Limpiar</Button>
```

### Tertiary
Botón terciario con outline. Para acciones menos importantes.
```jsx
<Button variant="tertiary">Ver más</Button>
<Button variant="tertiary" size="sm">Opciones</Button>
```

### Danger
Botón para acciones destructivas o de riesgo. Usa color rojo.
```jsx
<Button variant="danger">Eliminar</Button>
<Button variant="danger" size="sm">Borrar Paquete</Button>
```

### Success
Botón para acciones exitosas. Usa color verde.
```jsx
<Button variant="success">Completar</Button>
<Button variant="success" size="sm">Confirmar</Button>
```

### Outline
Botón con solo borde. Para acciones menos prominentes.
```jsx
<Button variant="outline">Editar</Button>
<Button variant="outline" size="sm">Más información</Button>
```

### Ghost
Botón sin fondo. Para acciones muy secundarias.
```jsx
<Button variant="ghost">Ver</Button>
<Button variant="ghost" size="sm">Revisar</Button>
```

### Link
Botón como enlace. Para navegación.
```jsx
<Button variant="link">Ir a inicio</Button>
<Button variant="link" size="sm">Ayuda</Button>
```

## Tamaños Disponibles

- `xs` - Extra pequeño (h-8, px-2)
- `sm` - Pequeño (h-9, px-3)
- `default` - Normal (h-10, px-4) [DEFAULT]
- `lg` - Grande (h-11, px-6)
- `xl` - Extra grande (h-12, px-8)
- `icon` - Cuadrado para iconos (h-10, w-10)

## Ejemplos de Uso

```jsx
import { Button } from "@/app/components/ui/button";

// Acciones principales
<Button variant="primary">Buscar Alojamientos</Button>

// Acciones destructivas
<Button variant="danger" onClick={handleDelete}>Eliminar</Button>

// Acciones confirmatorias
<Button variant="success">Guardar</Button>

// Acciones secundarias
<Button variant="secondary">Cancelar</Button>
<Button variant="outline">Ver opciones</Button>
<Button variant="ghost">Más información</Button>

// Diferentes tamaños
<Button variant="primary" size="lg">Botón Grande</Button>
<Button variant="primary" size="sm">Botón Pequeño</Button>
```

## Estados

Todos los botones soportan estados automáticos:
- **Hover**: Color más oscuro
- **Active**: Color más oscuro aún
- **Disabled**: Opacidad reducida, sin interacción
- **Focus**: Ring azul alrededor del botón

## Notas

- Los botones con shadow (primary, secondary, danger, success) tienen efecto de sombra que aumenta en hover
- Todos los botones tienen transiciones suaves
- El tamaño por defecto es `default` (h-10)
