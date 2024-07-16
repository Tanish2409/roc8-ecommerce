interface Route {
  link: string;
}

type Routes = Record<string, Route>;

export const authenticatedRoutes = {
  categories: {
    link: "/categories",
  },
} satisfies Routes;

export const publicRoutes = {
  homepage: {
    link: "/",
  },

  // auth routes
  sigup: {
    link: "/auth/signup",
  },

  login: {
    link: "/auth/login",
  },

  verifyOtp: {
    link: "/auth/verify-otp",
  },
} satisfies Routes;

const getLinksFromRoutes = (routesObj: Routes): string[] => {
  const links: string[] = [];

  for (const key in routesObj) {
    if (routesObj[key]!.link) {
      links.push(routesObj[key]!.link);
    }
  }

  return links;
};

export const authenticatedRouteLinks: string[] =
  getLinksFromRoutes(authenticatedRoutes);

export const publicRouteLinks: string[] = getLinksFromRoutes(publicRoutes);
