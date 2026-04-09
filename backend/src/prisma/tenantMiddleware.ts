// Tenant middleware deprecated - using Mongoose middleware instead
// Multi-tenancy is enforced at the controller level via collegeId scoping
// See src/middlewares/rbac.ts for authorization and scoping logic

export function tenantMiddleware(collegeId: string | undefined) {
  return async (params: any) => {
    throw new Error('Prisma middleware no longer used - see src/middlewares/rbac.ts');
  };
}
