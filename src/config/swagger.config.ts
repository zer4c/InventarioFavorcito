import {
  OpenApiGeneratorV3,
  OpenAPIRegistry,
} from '@asteasolutions/zod-to-openapi';

export const registry = new OpenAPIRegistry();

export function generateOpenAPIDocument() {
  const generator = new OpenApiGeneratorV3(registry.definitions);
  return generator.generateDocument({
    openapi: '3.0.1',
    info: {
      title: 'InventarioFacilito API',
      version: '1.0.0',
      description: 'API para gestion de inventario',
    },
    servers: [{ url: '/', description: 'Servidor principal' }],
  });
}
