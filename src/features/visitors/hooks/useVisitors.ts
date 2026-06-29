import { useAppDispatch, useAppSelector } from '@store/hooks';
import { setSearchQuery, setFilterStatus } from '../store/visitorSlice';

export const useVisitors = () => {
  const dispatch = useAppDispatch();
  const { list, filtered, searchQuery, filterStatus, loading } = useAppSelector(
    (state) => state.visitors
  );

  const search = (query: string) => dispatch(setSearchQuery(query));
  const filter = (status: string) => dispatch(setFilterStatus(status));

  return { list, filtered, searchQuery, filterStatus, loading, search, filter };
};
