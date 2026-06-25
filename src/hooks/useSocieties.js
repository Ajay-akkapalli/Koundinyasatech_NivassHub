import { useSelector, useDispatch } from 'react-redux';
import {
  setSocieties,
  addSociety,
  updateSociety,
  deleteSociety,
  setLoading,
  setError,
} from '../store/slices/societySlice';
import { societyService } from '../services/societyService';

export const useSocieties = () => {
  const dispatch = useDispatch();
  const { societies, loading, error } = useSelector((state) => state.societies);

  const fetchSocieties = async () => {
    dispatch(setLoading(true));
    try {
      const data = await societyService.getSocieties();
      dispatch(setSocieties(data));
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const create = async (formData) => {
    dispatch(setLoading(true));
    try {
      const society = await societyService.createSociety(formData);
      dispatch(addSociety(society));
      return { success: true, society };
    } catch (err) {
      dispatch(setError(err.message));
      return { success: false, error: err.message };
    } finally {
      dispatch(setLoading(false));
    }
  };

  const update = async (id, formData) => {
    dispatch(setLoading(true));
    try {
      const society = await societyService.updateSociety(id, formData);
      dispatch(updateSociety(society));
      return { success: true, society };
    } catch (err) {
      dispatch(setError(err.message));
      return { success: false, error: err.message };
    } finally {
      dispatch(setLoading(false));
    }
  };

  const remove = async (id) => {
    dispatch(setLoading(true));
    try {
      await societyService.deleteSociety(id);
      dispatch(deleteSociety(id));
      return { success: true };
    } catch (err) {
      dispatch(setError(err.message));
      return { success: false, error: err.message };
    } finally {
      dispatch(setLoading(false));
    }
  };

  return { societies, loading, error, fetchSocieties, create, update, remove };
};
