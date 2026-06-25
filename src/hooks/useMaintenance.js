import { useSelector, useDispatch } from 'react-redux';
import { setSearchQuery, setFilterStatus } from '../store/slices/maintenanceSlice';

export const useMaintenance = () => {
  const dispatch = useDispatch();
  const { list, filtered, searchQuery, filterStatus, loading } = useSelector(
    (state) => state.maintenance
  );

  const search = (query) => dispatch(setSearchQuery(query));
  const filter = (status) => dispatch(setFilterStatus(status));

  return { list, filtered, searchQuery, filterStatus, loading, search, filter };
};
