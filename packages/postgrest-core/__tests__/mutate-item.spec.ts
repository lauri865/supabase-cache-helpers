import { DecodedKey, PostgrestFilter } from '../src';
import {
  AnyPostgrestResponse,
  PostgrestHasMorePaginationResponse,
} from '../src/lib/response-types';
import {
  MutateItemOperation,
  mutateOperation,
  mutateItem,
} from '../src/mutate-item';

type ItemType = {
  [idx: string]: string | null;
  id_1: string;
  id_2: string;
  value: string | null;
};

const mutateFnMock = async (
  input: Pick<ItemType, 'id_1' | 'id_2'>,
  mutateInput: (current: ItemType) => ItemType,
  decodedKey: null | Partial<DecodedKey>,
  postgrestFilter: Partial<Record<keyof PostgrestFilter<ItemType>, boolean>>,
) => {
  const mock = jest.fn();
  await mutateItem<string, ItemType>(
    {
      input: input as ItemType,
      mutate: mutateInput,
      schema: 'schema',
      table: 'table',
      primaryKeys: ['id_1', 'id_2'],
    },
    {
      cacheKeys: ['1'],
      decode() {
        return decodedKey === null
          ? null
          : {
              schema: decodedKey.schema || 'schema',
              table: decodedKey.table || 'table',
              queryKey: decodedKey.queryKey || 'queryKey',
              bodyKey: decodedKey.bodyKey,
              orderByKey: decodedKey.orderByKey,
              count: decodedKey.count || null,
              isHead: decodedKey.isHead,
              limit: decodedKey.limit,
              offset: decodedKey.offset,
            };
      },
      getPostgrestFilter() {
        return {
          denormalize<ItemType>(obj: ItemType): ItemType {
            return obj;
          },
          hasPaths(obj: unknown): obj is ItemType {
            return typeof postgrestFilter.hasPaths === 'boolean'
              ? postgrestFilter.hasPaths
              : true;
          },
          applyFilters(obj): obj is ItemType {
            return typeof postgrestFilter.applyFilters === 'boolean'
              ? postgrestFilter.applyFilters
              : true;
          },
          hasFiltersOnPaths() {
            return typeof postgrestFilter.hasFiltersOnPaths === 'boolean'
              ? postgrestFilter.hasFiltersOnPaths
              : true;
          },
          applyFiltersOnPaths(obj: unknown): obj is ItemType {
            return typeof postgrestFilter.applyFiltersOnPaths === 'boolean'
              ? postgrestFilter.applyFiltersOnPaths
              : true;
          },
          apply(obj: unknown): obj is ItemType {
            return typeof postgrestFilter.apply === 'boolean'
              ? postgrestFilter.apply
              : true;
          },
        };
      },
      mutate: mock,
    },
  );

  return mock;
};

type RelationType = {
  id: string;
  fkey: string;
};

const mutateRelationMock = async (
  decodedKey: null | Partial<DecodedKey>,
  op?: Pick<
    MutateItemOperation<RelationType>,
    'revalidateTables' | 'revalidateRelations'
  >,
) => {
  const mock = jest.fn();
  await mutateItem<string, RelationType>(
    {
      input: { id: '1', fkey: '1' },
      mutate: (curr) => curr ?? { id: '1', fkey: '1' },
      schema: 'schema',
      table: 'table',
      primaryKeys: ['id'],
      ...op,
    },
    {
      cacheKeys: ['1'],
      decode() {
        return decodedKey === null
          ? null
          : {
              schema: decodedKey.schema || 'schema',
              table: decodedKey.table || 'relation',
              queryKey: decodedKey.queryKey || 'queryKey',
              bodyKey: decodedKey.bodyKey,
              orderByKey: decodedKey.orderByKey,
              count: decodedKey.count || null,
              isHead: decodedKey.isHead,
              limit: decodedKey.limit,
              offset: decodedKey.offset,
            };
      },
      getPostgrestFilter() {
        return {
          denormalize<RelationType>(obj: RelationType): RelationType {
            return obj;
          },
          hasPaths(obj: unknown): obj is RelationType {
            return true;
          },
          applyFilters(obj): obj is RelationType {
            return true;
          },
          hasFiltersOnPaths() {
            return true;
          },
          applyFiltersOnPaths(obj: unknown): obj is RelationType {
            return true;
          },
          apply(obj: unknown): obj is RelationType {
            return true;
          },
        };
      },
      mutate: mock,
    },
  );

  return mock;
};

const mutateFnResult = async (
  input: Pick<ItemType, 'id_1' | 'id_2'>,
  mutateInput: (current: ItemType) => ItemType,
  decodedKey: Partial<DecodedKey>,
  postgrestFilter: Partial<Record<keyof PostgrestFilter<ItemType>, boolean>>,
  currentData:
    | AnyPostgrestResponse<ItemType>
    | PostgrestHasMorePaginationResponse<ItemType>
    | unknown,
) => {
  return await new Promise(async (res) => {
    mutateItem<string, ItemType>(
      {
        input: input as ItemType,
        mutate: mutateInput,
        schema: 'schema',
        table: 'table',
        primaryKeys: ['id_1', 'id_2'],
      },

      {
        cacheKeys: ['1'],
        decode() {
          return {
            schema: decodedKey.schema || 'schema',
            table: decodedKey.table || 'table',
            queryKey: decodedKey.queryKey || 'queryKey',
            bodyKey: decodedKey.bodyKey,
            orderByKey: decodedKey.orderByKey,
            count: decodedKey.count || null,
            isHead: decodedKey.isHead,
            limit: decodedKey.limit,
            offset: decodedKey.offset,
          };
        },
        getPostgrestFilter() {
          return {
            denormalize<ItemType>(obj: ItemType): ItemType {
              return obj;
            },
            hasPaths(obj: unknown): obj is ItemType {
              return typeof postgrestFilter.hasPaths === 'boolean'
                ? postgrestFilter.hasPaths
                : true;
            },
            applyFilters(obj): obj is ItemType {
              return typeof postgrestFilter.applyFilters === 'boolean'
                ? postgrestFilter.applyFilters
                : true;
            },
            hasFiltersOnPaths() {
              return typeof postgrestFilter.hasFiltersOnPaths === 'boolean'
                ? postgrestFilter.hasFiltersOnPaths
                : true;
            },
            applyFiltersOnPaths(obj: unknown): obj is ItemType {
              return typeof postgrestFilter.applyFiltersOnPaths === 'boolean'
                ? postgrestFilter.applyFiltersOnPaths
                : true;
            },
            apply(obj: unknown): obj is ItemType {
              return typeof postgrestFilter.apply === 'boolean'
                ? postgrestFilter.apply
                : true;
            },
          };
        },
        mutate: jest.fn((_, fn) => {
          expect(fn).toBeDefined();
          expect(fn).toBeInstanceOf(Function);
          res(fn!(currentData));
        }),
      },
    );
  });
};

describe('mutateItem', () => {
  it('should call mutate for revalidateRelations', async () => {
    const mutateMock = await mutateRelationMock(
      {
        schema: 'schema',
        table: 'relation',
      },
      {
        revalidateRelations: [
          {
            relation: 'relation',
            fKeyColumn: 'fkey',
            relationIdColumn: 'id',
            schema: 'schema',
          },
        ],
      },
    );
    expect(mutateMock).toHaveBeenCalledTimes(1);
    expect(mutateMock).toHaveBeenCalledWith('1');
  });

  it('should call mutate for revalidateTables', async () => {
    const mutateMock = await mutateRelationMock(
      {
        schema: 'schema',
        table: 'relation',
      },
      {
        revalidateTables: [{ schema: 'schema', table: 'relation' }],
      },
    );
    expect(mutateMock).toHaveBeenCalledTimes(1);
    expect(mutateMock).toHaveBeenCalledWith('1');
  });

  it('should exit early if not a postgrest key', async () => {
    const mutateMock = await mutateFnMock(
      { id_1: '0', id_2: '0' },
      (c) => c,
      null,
      {},
    );
    expect(mutateMock).toHaveBeenCalledTimes(0);
  });

  it('should not apply mutation if input does not have value for all pks', async () => {
    const mutateMock = await mutateFnMock(
      { id_1: '0' } as ItemType,
      (c) => c,
      {},
      {
        apply: false,
        applyFilters: false,
        hasPaths: false,
        hasFiltersOnPaths: true,
        applyFiltersOnPaths: true,
      },
    );
    expect(mutateMock).toHaveBeenCalledTimes(0);
  });

  it('should not apply mutation if key does have filters on pks, but input does not match pk filters', async () => {
    const mutateMock = await mutateFnMock(
      { id_1: '0', id_2: '1' },
      (c) => c,
      {},
      {
        apply: false,
        applyFilters: false,
        hasPaths: false,
        hasFiltersOnPaths: true,
        applyFiltersOnPaths: false,
      },
    );
    expect(mutateMock).toHaveBeenCalledTimes(0);
  });

  it('should apply mutation if key does have filters on pks, and input does match pk filters', async () => {
    const mutateMock = await mutateFnMock(
      { id_1: '0', id_2: '0' },
      (c) => c,
      {},
      {
        apply: false,
        applyFilters: false,
        hasPaths: false,
        hasFiltersOnPaths: true,
        applyFiltersOnPaths: true,
      },
    );
    expect(mutateMock).toHaveBeenCalledTimes(1);
  });

  it('should apply mutation if key does not have filters on pks', async () => {
    const mutateMock = await mutateFnMock(
      { id_1: '0', id_2: '0' },
      (c) => c,
      {},
      {
        apply: false,
        applyFilters: false,
        hasPaths: false,
        hasFiltersOnPaths: false,
        applyFiltersOnPaths: true,
      },
    );
    expect(mutateMock).toHaveBeenCalledTimes(1);
  });

  it('should do nothing if item does not exist in currentData', async () => {
    expect(
      await mutateFnResult(
        { id_1: '0', id_2: '0' },
        (curr) => ({ ...curr, value: 'test' }),
        {
          limit: 2,
        },
        {
          apply: true,
          hasPaths: true,
        },
        [
          [
            { id_1: '1', id_2: '0', value: 'test1' },
            { id_1: '0', id_2: '1', value: 'test2' },
          ],
          [
            { id_1: '1', id_2: '0', value: 'test3' },
            { id_1: '0', id_2: '1', value: 'test4' },
          ],
        ],
      ),
    ).toEqual([
      [
        { id_1: '1', id_2: '0', value: 'test1' },
        { id_1: '0', id_2: '1', value: 'test2' },
      ],
      [
        { id_1: '1', id_2: '0', value: 'test3' },
        { id_1: '0', id_2: '1', value: 'test4' },
      ],
    ]);
  });

  it('should update item within paged cache data', async () => {
    expect(
      await mutateFnResult(
        { id_1: '0', id_2: '0' },
        (curr) => ({ ...curr, value: 'test' }),
        {
          limit: 3,
        },
        {
          apply: true,
          hasPaths: false,
        },
        [
          [
            { id_1: '1', id_2: '0', value: 'test1' },
            { id_1: '0', id_2: '1', value: 'test2' },
            { id_1: '1', id_2: '0', value: 'test3' },
          ],
          [
            { id_1: '0', id_2: '1', value: 'test4' },
            { id_1: '0', id_2: '0', value: 'test5' },
          ],
        ],
      ),
    ).toEqual([
      [
        { id_1: '1', id_2: '0', value: 'test1' },
        { id_1: '0', id_2: '1', value: 'test2' },
        { id_1: '1', id_2: '0', value: 'test3' },
      ],
      [
        { id_1: '0', id_2: '1', value: 'test4' },
        { id_1: '0', id_2: '0', value: 'test' },
      ],
    ]);
  });

  it('should remove item if updated values do not apply to key', async () => {
    expect(
      await mutateFnResult(
        { id_1: '0', id_2: '1' },
        (curr) => ({ ...curr, value: 'test' }),
        {
          limit: 2,
        },
        {
          apply: false,
          hasPaths: false,
        },
        [
          [
            { id_1: '1', id_2: '0', value: 'test1' },
            { id_1: '0', id_2: '1', value: 'test2' },
          ],
          [
            { id_1: '0', id_2: '0', value: 'test3' },
            { id_1: '1', id_2: '1', value: 'test4' },
          ],
        ],
      ),
    ).toEqual([
      [
        { id_1: '1', id_2: '0', value: 'test1' },
        { id_1: '0', id_2: '0', value: 'test3' },
      ],
      [{ id_1: '1', id_2: '1', value: 'test4' }],
    ]);
  });

  it('should do nothing if cached data is undefined', async () => {
    expect(
      await mutateFnResult(
        { id_1: '0', id_2: '0' },
        (curr) => ({ ...curr, value: 'test' }),
        {},
        { apply: true, hasPaths: true },
        undefined,
      ),
    ).toEqual(undefined);
  });

  it('should do nothing if cached data is null', async () => {
    expect(
      await mutateFnResult(
        { id_1: '0', id_2: '0' },
        (curr) => ({ ...curr, value: 'test' }),
        {},
        { apply: true, hasPaths: true },
        null,
      ),
    ).toEqual(null);
  });

  it('should do nothing if cached data is null', async () => {
    expect(
      await mutateFnResult(
        { id_1: '0', id_2: '0' },
        (curr) => ({ ...curr, value: 'test' }),
        {},
        { apply: true, hasPaths: true },
        [
          { id_1: '1', id_2: '0', value: 'array1' },
          { id_1: '0', id_2: '1', value: 'array2' },
        ],
      ),
    ).toEqual([
      { id_1: '1', id_2: '0', value: 'array1' },
      { id_1: '0', id_2: '1', value: 'array2' },
    ]);
  });

  it('should update item within cached array', async () => {
    expect(
      await mutateFnResult(
        { id_1: '0', id_2: '0' },
        (curr) => ({ ...curr, value: 'test' }),
        {},
        { apply: true, hasPaths: false },
        {
          data: [
            { id_1: '1', id_2: '0', value: 'test3' },
            { id_1: '0', id_2: '1', value: 'test4' },
            { id_1: '0', id_2: '0', value: 'test5' },
          ],
          count: 3,
        },
      ),
    ).toEqual({
      data: [
        { id_1: '1', id_2: '0', value: 'test3' },
        { id_1: '0', id_2: '1', value: 'test4' },
        { id_1: '0', id_2: '0', value: 'test' },
      ],
      count: 3,
    });
  });

  it('should remove item within cached array if values do not match after update', async () => {
    expect(
      await mutateFnResult(
        { id_1: '0', id_2: '0' },
        (curr) => ({ ...curr, value: 'test' }),
        {},
        { apply: false, hasPaths: false },
        {
          data: [
            { id_1: '1', id_2: '0', value: 'test3' },
            { id_1: '0', id_2: '1', value: 'test4' },
            { id_1: '0', id_2: '0', value: 'test5' },
          ],
          count: 3,
        },
      ),
    ).toEqual({
      data: [
        { id_1: '1', id_2: '0', value: 'test3' },
        { id_1: '0', id_2: '1', value: 'test4' },
      ],
      count: 2,
    });
  });

  it('should set data to undefined if updated item is invalid', async () => {
    expect(
      await mutateFnResult(
        { id_1: '0', id_2: '0' },
        (curr) => ({ ...curr, value: 'test' }),
        {},
        { apply: false, hasPaths: false },
        { data: { id_1: '0', id_2: '0', value: 'test5' } },
      ),
    ).toEqual({
      data: null,
    });
  });
  it('should return merged data if updated item matches the key filter', async () => {
    expect(
      await mutateFnResult(
        { id_1: '0', id_2: '0' },
        (curr) => ({ ...curr, value: 'test' }),
        {},
        { apply: true, hasPaths: true },
        { data: { id_1: '0', id_2: '0', value: 'test5' } },
      ),
    ).toEqual({
      data: { id_1: '0', id_2: '0', value: 'test' },
    });
  });

  it('should respect order by asc', async () => {
    expect(
      await mutateFnResult(
        { id_1: '0', id_2: '0' },
        (curr) => ({ ...curr, value: 'test4' }),
        {
          limit: 2,
          orderByKey: 'value:asc.nullsFirst',
        },
        { apply: true, hasPaths: false },
        [
          [
            { id_1: '0', id_2: '0', value: 'test1' },
            { id_1: '0', id_2: '1', value: 'test2' },
          ],
          [
            { id_1: '2', id_2: '0', value: 'test3' },
            { id_1: '0', id_2: '2', value: 'test5' },
          ],
        ],
      ),
    ).toEqual([
      [
        { id_1: '0', id_2: '1', value: 'test2' },
        { id_1: '2', id_2: '0', value: 'test3' },
      ],
      [
        { id_1: '0', id_2: '0', value: 'test4' },
        { id_1: '0', id_2: '2', value: 'test5' },
      ],
    ]);
  });

  it('should respect order by desc', async () => {
    expect(
      await mutateFnResult(
        { id_1: '0', id_2: '2' },
        (curr) => ({ ...curr, value: 'test4' }),
        {
          limit: 2,
          orderByKey: 'value:desc.nullsFirst',
        },
        { apply: true, hasPaths: false },
        [
          [
            { id_1: '1', id_2: '0', value: 'test5' },
            { id_1: '0', id_2: '1', value: 'test3' },
          ],
          [
            { id_1: '2', id_2: '0', value: 'test2' },
            { id_1: '0', id_2: '2', value: 'test1' },
          ],
        ],
      ),
    ).toEqual([
      [
        { id_1: '1', id_2: '0', value: 'test5' },
        { id_1: '0', id_2: '2', value: 'test4' },
      ],
      [
        { id_1: '0', id_2: '1', value: 'test3' },
        { id_1: '2', id_2: '0', value: 'test2' },
      ],
    ]);
  });

  it('should respect order by nullsFirst', async () => {
    expect(
      await mutateFnResult(
        { id_1: '0', id_2: '2' },
        (curr) => ({ ...curr, value: null }),
        {
          limit: 2,
          orderByKey: 'value:asc.nullsFirst',
        },
        { apply: true, hasPaths: false },
        [
          [
            { id_1: '1', id_2: '0', value: 'test1' },
            { id_1: '0', id_2: '1', value: 'test2' },
          ],
          [
            { id_1: '2', id_2: '0', value: 'test3' },
            { id_1: '0', id_2: '2', value: 'test5' },
          ],
        ],
      ),
    ).toEqual([
      [
        { id_1: '0', id_2: '2', value: null },
        { id_1: '1', id_2: '0', value: 'test1' },
      ],
      [
        { id_1: '0', id_2: '1', value: 'test2' },
        { id_1: '2', id_2: '0', value: 'test3' },
      ],
    ]);
  });

  it('should respect order by nullsLast', async () => {
    expect(
      await mutateFnResult(
        { id_1: '1', id_2: '0' },
        (curr) => ({ ...curr, value: null }),
        {
          limit: 2,
          orderByKey: 'value:asc.nullsLast',
        },
        { apply: true, hasPaths: false },
        [
          [
            { id_1: '1', id_2: '0', value: 'test1' },
            { id_1: '0', id_2: '1', value: 'test2' },
          ],
          [
            { id_1: '2', id_2: '0', value: 'test3' },
            { id_1: '0', id_2: '2', value: 'test5' },
          ],
        ],
      ),
    ).toEqual([
      [
        { id_1: '0', id_2: '1', value: 'test2' },
        { id_1: '2', id_2: '0', value: 'test3' },
      ],
      [
        { id_1: '0', id_2: '2', value: 'test5' },
        { id_1: '1', id_2: '0', value: null },
      ],
    ]);
  });

  it('should work with head queries', async () => {
    expect(
      await mutateFnResult(
        { id_1: '0', id_2: '0' },
        (curr) => ({ ...curr, value: 'test' }),
        {},
        { apply: true, hasPaths: true },
        {
          data: null,
          count: 3,
        },
      ),
    ).toEqual({
      data: null,
      count: 3,
    });
  });

  describe('mutateOperation', () => {
    type ItemType = {
      [idx: string]: string | number | null;
      id_1: number;
      id_2: number;
      value_1: number | null;
      value_2: number | null;
    };

    it('remove unordered', () => {
      expect(
        mutateOperation<ItemType>(
          { id_1: 3, id_2: 3 },
          (c) => ({ ...c, value_1: 1, value_2: 1 }),
          [
            { id_1: 1, id_2: 1, value_1: 3, value_2: 3 },
            { id_1: 2, id_2: 2, value_1: 2, value_2: 2 },
            { id_1: 3, id_2: 3, value_1: 1, value_2: 1 },
          ],
          ['id_1', 'id_2'],
          {
            apply(obj: unknown): obj is ItemType {
              return false;
            },
          },
        ),
      ).toEqual([
        { id_1: 1, id_2: 1, value_1: 3, value_2: 3 },
        { id_1: 2, id_2: 2, value_1: 2, value_2: 2 },
      ]);
    });

    it('remove ordered', () => {
      expect(
        mutateOperation<ItemType>(
          { id_1: 2, id_2: 2 },
          (c) => ({ ...c, value_1: 0, value_2: 0 }),
          [
            { id_1: 1, id_2: 1, value_1: 3, value_2: 3 },
            { id_1: 2, id_2: 2, value_1: 2, value_2: 2 },
            { id_1: 3, id_2: 3, value_1: 1, value_2: 1 },
          ],
          ['id_1', 'id_2'],
          {
            apply(obj: unknown): obj is ItemType {
              return false;
            },
          },
          [{ column: 'value_1', ascending: false, nullsFirst: false }],
        ),
      ).toEqual([
        { id_1: 1, id_2: 1, value_1: 3, value_2: 3 },
        { id_1: 3, id_2: 3, value_1: 1, value_2: 1 },
      ]);
    });

    it('update unordered', () => {
      expect(
        mutateOperation<ItemType>(
          { id_1: 0, id_2: 0 },
          (c) => ({ ...c, value_1: 1, value_2: 1 }),
          [
            { id_1: 1, id_2: 1, value_1: 3, value_2: 3 },
            { id_1: 0, id_2: 0, value_1: 2, value_2: 2 },
            { id_1: 3, id_2: 3, value_1: 1, value_2: 1 },
          ],
          ['id_1', 'id_2'],

          {
            apply(obj: unknown): obj is ItemType {
              return true;
            },
          },
        ),
      ).toEqual([
        { id_1: 1, id_2: 1, value_1: 3, value_2: 3 },
        { id_1: 0, id_2: 0, value_1: 1, value_2: 1 },
        { id_1: 3, id_2: 3, value_1: 1, value_2: 1 },
      ]);
    });

    it('update ordered', () => {
      expect(
        mutateOperation<ItemType>(
          { id_1: 2, id_2: 2 },
          (c) => ({ ...c, value_1: 0, value_2: 0 }),
          [
            { id_1: 1, id_2: 1, value_1: 3, value_2: 3 },
            { id_1: 2, id_2: 2, value_1: 2, value_2: 2 },
            { id_1: 3, id_2: 3, value_1: 1, value_2: 1 },
          ],
          ['id_1', 'id_2'],
          {
            apply(obj: unknown): obj is ItemType {
              return true;
            },
          },
          [{ column: 'value_1', ascending: false, nullsFirst: false }],
        ),
      ).toEqual([
        { id_1: 1, id_2: 1, value_1: 3, value_2: 3 },
        { id_1: 3, id_2: 3, value_1: 1, value_2: 1 },
        { id_1: 2, id_2: 2, value_1: 0, value_2: 0 },
      ]);
    });
  });
});
