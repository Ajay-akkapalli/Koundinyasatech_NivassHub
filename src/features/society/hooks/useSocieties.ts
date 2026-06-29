import { useAppDispatch, useAppSelector } from '@store/hooks';
import {
  setSocieties,
  addSociety,
  updateSociety,
  deleteSociety,
  setLoading,
  setError,
} from '../store/societySlice';
import { societyService } from '../services/societyService';
import type { SocietyFormData } from '../types';
import type { AsyncResult } from '@/types/common';
import type { Society } from '../types';

export const useSocieties = () => {
  const dispatch = useAppDispatch();
  const { societies, loading, error } = useAppSelector((state) => state.societies);

  const fetchSocieties = async (): Promise<void> => {
    dispatch(setLoading(true));
    try {
      const data = await societyService.getSocieties();
      dispatch(setSocieties(data));
    } catch (err) {
      dispatch(setError((err as Error).message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const create = async (formData: SocietyFormData): Promise<AsyncResult<Society>> => {
    dispatch(setLoading(true));
    try {
      const society = await societyService.createSociety(formData);
      dispatch(addSociety(society));
      return { success: true, data: society };
    } catch (err) {
      dispatch(setError((err as Error).message));
      return { success: false, error: (err as Error).message };
    } finally {
      dispatch(setLoading(false));
    }
  };

  const update = async (id: string, formData: SocietyFormData): Promise<AsyncResult<Society>> => {
    dispatch(setLoading(true));
    try {
      const society = await societyService.updateSociety(id, formData);
      dispatch(updateSociety(society));
      return { success: true, data: society };
    } catch (err) {
      dispatch(setError((err as Error).message));
      return { success: false, error: (err as Error).message };
    } finally {
      dispatch(setLoading(false));
    }
  };

  const remove = async (id: string): Promise<AsyncResult<void>> => {
    dispatch(setLoading(true));
    try {
      await societyService.deleteSociety(id);
      dispatch(deleteSociety(id));
      return { success: true };
    } catch (err) {
      dispatch(setError((err as Error).message));
      return { success: false, error: (err as Error).message };
    } finally {
      dispatch(setLoading(false));
    }
  };

  return { societies, loading, error, fetchSocieties, create, update, remove };
};
