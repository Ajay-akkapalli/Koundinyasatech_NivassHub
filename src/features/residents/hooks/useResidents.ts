import { useAppDispatch, useAppSelector } from '@store/hooks';
import { setSearchQuery, setFilterStatus } from '../store/residentSlice';

export const useResidents = () => {
  const dispatch = useAppDispatch();
  const { list, filtered, searchQuery, filterStatus, loading } = useAppSelector(
    (state) => state.residents
  );

  const search = (query: string) => dispatch(setSearchQuery(query));
  const filter = (status: string) => dispatch(setFilterStatus(status));

  return { list, filtered, searchQuery, filterStatus, loading, search, filter };
};
