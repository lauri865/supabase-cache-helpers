import { PostgrestQueryBuilder } from '@supabase/postgrest-js';
import { GetResult } from '@supabase/postgrest-js/dist/module/select-query-parser';
import {
  GenericSchema,
  GenericTable,
} from '@supabase/postgrest-js/dist/module/types';

import {
  buildMutationFetcherResponse,
  MutationFetcherResponse,
} from './fetch/build-mutation-fetcher-response';
import {
  buildNormalizedQuery,
  BuildNormalizedQueryOps,
} from './fetch/build-normalized-query';

export type UpdateFetcher<T extends GenericTable, R> = (
  input: Partial<T['Row']>,
) => Promise<MutationFetcherResponse<R> | null>;

export type UpdateFetcherOptions<
  S extends GenericSchema,
  T extends GenericTable,
  Re = T extends { Relationships: infer R } ? R : unknown,
> = Parameters<PostgrestQueryBuilder<S, T, Re>['update']>[1] & {
  stripPrimaryKeys?: boolean;
};

export const buildUpdateFetcher =
  <
    S extends GenericSchema,
    T extends GenericTable,
    RelationName,
    Re = T extends { Relationships: infer R } ? R : unknown,
    Q extends string = '*',
    R = GetResult<S, T['Row'], RelationName, Re, Q extends '*' ? '*' : Q>,
  >(
    qb: PostgrestQueryBuilder<S, T, Re>,
    primaryKeys: (keyof T['Row'])[],
    {
      stripPrimaryKeys = true,
      ...opts
    }: BuildNormalizedQueryOps<Q> & UpdateFetcherOptions<S, T>,
  ): UpdateFetcher<T, R> =>
  async (
    input: Partial<T['Row']>,
  ): Promise<MutationFetcherResponse<R> | null> => {
    const payload = { ...input };
    let filterBuilder = qb.update(payload as any, opts); // todo fix type;
    for (const key of primaryKeys) {
      const value = input[key];
      if (!value)
        throw new Error(`Missing value for primary key ${String(key)}`);
      filterBuilder = filterBuilder.eq(key as string, value);

      if (stripPrimaryKeys) {
        payload[key] = undefined;
      }
    }
    const query = buildNormalizedQuery<Q>(opts);
    if (query) {
      const { selectQuery, userQueryPaths, paths } = query;
      const { data } = await filterBuilder
        .select(selectQuery)
        .throwOnError()
        .single();
      return buildMutationFetcherResponse(data as R, { userQueryPaths, paths });
    }
    await filterBuilder.throwOnError().single();
    return null;
  };
