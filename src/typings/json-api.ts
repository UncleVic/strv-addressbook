export type TResponseMeta = Record<string, unknown>;

export type TResponseLink = string | { href: string; meta: TResponseMeta };

export type TResponseResourceLinks = {
  self?: TResponseLink;
  related?: TResponseLink;
  first?: TResponseLink;
  last?: TResponseLink;
  prev?: TResponseLink;
  next?: TResponseLink;
};

export type TResponseResourceIdentifierObject = {
  type: string;
  id: string;
  meta?: TResponseMeta;
};

export type TResponseRelationships = {
  links?: Pick<TResponseResourceLinks, 'self' | 'related'>;
  data?: TResponseResourceIdentifierObject;
  meta?: TResponseMeta;
};

export type TResponseResourceObject = TResponseResourceIdentifierObject & {
  attributes?: Record<string, unknown>;
  relationships?: Record<string, TResponseRelationships | TResponseRelationships[]>;
  links?: TResponseResourceLinks;
};

export type TResponseError = {
  id?: string;
  links?: {
    about: TResponseLink;
  };
  status: number;
  code?: number | string;
  title?: string;
  detail?: string;
  source?: {
    pointer?: string;
    parameter?: string;
  };
  meta?: TResponseMeta;
};

export type TResponse<T extends TResponseResourceObject | TResponseResourceObject[] = TResponseResourceObject> = {
  data?: T;
  errors?: TResponseError[];
  meta?: TResponseMeta;
  jsonapi?: {
    version: '1.0' | '1.1';
  };
  links?: TResponseResourceLinks;
  included?: TResponseResourceObject[];
};
