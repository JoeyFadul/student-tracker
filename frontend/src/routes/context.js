import { createContext, useContext } from 'react';

// Auth state from useAuth(), provided above the router so route guards can
// read it.
export const AuthContext = createContext(null);
export const useAuthCtx = () => useContext(AuthContext);

// { api, classrooms } — provided by AuthedLayout, so it exists only while
// signed in.
export const ClassroomsContext = createContext(null);
export const useClassroomsCtx = () => useContext(ClassroomsContext);

// { api, classrooms, studentsApi, schoolYear, showToast } — provided by
// AppLayout for the tabbed screens.
export const AppDataContext = createContext(null);
export const useAppData = () => useContext(AppDataContext);
