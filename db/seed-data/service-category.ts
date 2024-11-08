import { v4 as UUID } from 'uuid'

export const seedServiceCategories = [
  {
    id: UUID(),
    name: 'Carpintería',
    description: 'Expertos en transformar madera en obras de arte. Desde muebles a medida hasta reparaciones delicadas.',
    icon: 'mdi:hammer'
  },
  {
    id: UUID(),
    name: 'Jardinería',
    description: 'Creamos y mantenemos espacios verdes que dan vida a tu hogar. Diseño de jardines, poda y cuidado de plantas.',
    icon: 'mdi:flower'
  },
  {
    id: UUID(),
    name: 'Plomería',
    description: 'Solucionamos problemas de tuberías y drenajes. Instalaciones, reparaciones y mantenimiento para mantener el agua fluyendo.',
    icon: 'mdi:pipe-wrench'
  },
  {
    id: UUID(),
    name: 'Electricidad',
    description: 'Iluminamos tu vida con seguridad. Instalaciones eléctricas, reparaciones y soluciones de ahorro energético.',
    icon: 'mdi:lightning-bolt'
  },
  {
    id: UUID(),
    name: 'Pintura',
    description: 'Damos color a tus espacios. Pintado de interiores y exteriores, técnicas decorativas y restauración.',
    icon: 'mdi:format-paint'
  },
  {
    id: UUID(),
    name: 'Limpieza',
    description: 'Mantenemos tu espacio impecable. Limpieza profunda, desinfección y organización para hogares y oficinas.',
    icon: 'mdi:broom'
  }
]
