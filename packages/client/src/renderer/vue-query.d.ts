import * as vueQuery from '@tanstack/vue-query';

declare module '@tanstack/vue-query' {
  function useQuery<
    TQueryFnData = unknown,
    TError = unknown,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey
  >(
    options:
      | UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>
      | Ref<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>>
  ): UseQueryReturnType<TData, TError>;
}
