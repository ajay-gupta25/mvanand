export interface Permission {
    [moduleName: string]: {
      create: boolean;
      update: boolean;
      delete: boolean;
      view: boolean;
      importExport: boolean;
      all: boolean;
    };
  }

 export interface RouteData {
    modules: string;
    accessType: string;
  }