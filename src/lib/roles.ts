export const isTeacher = (user?: { role?: string }) => user?.role === "TEACHER";
export const isFormateur = (user?: { role?: string }) =>
  user?.role === "FORMATEUR";
export const isAdmin = (user?: { role?: string }) => user?.role === "ADMIN";
