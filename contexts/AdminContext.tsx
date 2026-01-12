import React, { createContext, useState, ReactNode, useEffect } from 'react';
import type { Tour, Inquiry, InquiryStatus, SiteSettings, LogEntry } from '../types';
import { supabase } from '../lib/supabaseClient';
import type { Session } from '@supabase/supabase-js';

// --- KEY CONVERSION HELPERS ---
// Converts object keys from snake_case to camelCase and vice-versa for Supabase mapping
function convertKeys(obj: any, converter: (key: string) => string): any {
    if (Array.isArray(obj)) {
        return obj.map(v => convertKeys(v, converter));
    } else if (obj !== null && obj && typeof obj === 'object' && !Array.isArray(obj) && obj.constructor === Object) {
        return Object.keys(obj).reduce((acc, key) => {
            const newKey = converter(key);
            acc[newKey] = convertKeys(obj[key], converter);
            return acc;
        }, {} as any);
    }
    return obj;
}
const toCamelCase = (s: string) => s.replace(/_([a-z])/g, g => g[1].toUpperCase());
const toSnakeCase = (s: string) => s.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);


// --- CONTEXT TYPE ---
interface AdminContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  tours: Tour[];
  inquiries: Inquiry[];
  settings: SiteSettings;
  logEntries: LogEntry[];
  updateInquiryStatus: (id: string, status: InquiryStatus) => Promise<void>;
  addInquiry: (inquiry: Omit<Inquiry, 'id' | 'date' | 'status'>) => Promise<void>;
  updateTour: (tour: Tour) => Promise<void>;
  addTour: (tour: Omit<Tour, 'id'>) => Promise<void>;
  deleteTour: (id: string) => Promise<void>;
  updateSettings: (settings: SiteSettings) => Promise<void>;
  addLogEntry: (logEntry: Omit<LogEntry, 'id'>) => Promise<void>;
}

export const AdminContext = createContext<AdminContextType | undefined>(undefined);


// --- PROVIDER COMPONENT ---
export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [tours, setTours] = useState<Tour[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({ heroImage: '' });
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  
  useEffect(() => {
    const fetchInitialData = async (currentSession: Session | null) => {
        setIsLoading(true);
        try {
            // Public data (always fetch)
            const toursPromise = supabase.from('tours').select('*');
            const settingsPromise = supabase.from('settings').select('*').limit(1).single();

            const [toursRes, settingsRes] = await Promise.all([toursPromise, settingsPromise]);

            if (toursRes.error) throw toursRes.error;
            if (settingsRes.error) throw settingsRes.error;

            setTours(convertKeys(toursRes.data, toCamelCase) as Tour[]);
            setSettings(convertKeys(settingsRes.data, toCamelCase) as SiteSettings);

            // Protected data (fetch only if logged in)
            if (currentSession) {
                const inquiriesPromise = supabase.from('inquiries').select('*').order('created_at', { ascending: false });
                const logsPromise = supabase.from('log_entries').select('*').order('created_at', { ascending: false });
                const [inquiriesRes, logsRes] = await Promise.all([inquiriesPromise, logsPromise]);

                if (inquiriesRes.error) throw inquiriesRes.error;
                if (logsRes.error) throw logsRes.error;

                setInquiries(inquiriesRes.data.map(d => ({ ...convertKeys(d, toCamelCase), date: d.created_at, id: String(d.id) })) as Inquiry[]);
                setLogEntries(logsRes.data.map(d => ({...convertKeys(d, toCamelCase), id: String(d.id)})) as LogEntry[]);
            } else {
                 setInquiries([]);
                 setLogEntries([]);
            }

        } catch (error) {
            console.error("Error fetching data from Supabase:", error);
        } finally {
            setIsLoading(false);
        }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setIsAuthenticated(!!session);
        fetchInitialData(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setIsAuthenticated(!!session);
        // Refetch data when auth state changes (e.g., login/logout)
        fetchInitialData(session);
    });

    return () => subscription.unsubscribe();
}, []);


  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setIsLoading(false);
    if (error) {
        console.error("Login error:", error.message);
        return false;
    }
    return true;
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const updateInquiryStatus = async (id: string, status: InquiryStatus) => {
    const { data, error } = await supabase.from('inquiries').update({ status }).eq('id', id).select().single();
    if (error) return console.error("Error updating inquiry:", error);
    if (data) {
       setInquiries(prev => prev.map(inq => inq.id === id ? { ...convertKeys(data, toCamelCase), date: data.created_at } as Inquiry : inq));
    }
  };
  
  const addInquiry = async (inquiry: Omit<Inquiry, 'id' | 'date' | 'status'>) => {
    const { data, error } = await supabase.from('inquiries').insert(convertKeys(inquiry, toSnakeCase)).select().single();
    if (error) return console.error("Error adding inquiry:", error);
    if (data) {
        setInquiries(prev => [{ ...convertKeys(data, toCamelCase), date: data.created_at } as Inquiry, ...prev]);
    }
  };

  const updateTour = async (updatedTour: Tour) => {
    const { data, error } = await supabase.from('tours').update(convertKeys(updatedTour, toSnakeCase)).eq('id', updatedTour.id).select().single();
    if (error) return console.error("Error updating tour:", error);
    if (data) {
        setTours(prev => prev.map(t => t.id === updatedTour.id ? convertKeys(data, toCamelCase) as Tour : t));
    }
  };

  const addTour = async (tour: Omit<Tour, 'id'>) => {
    const { data, error } = await supabase.from('tours').insert(convertKeys(tour, toSnakeCase)).select().single();
     if (error) return console.error("Error adding tour:", error);
     if (data) {
        setTours(prev => [...prev, convertKeys(data, toCamelCase) as Tour]);
     }
  };

  const deleteTour = async (id: string) => {
    const { error } = await supabase.from('tours').delete().eq('id', id);
    if (error) return console.error("Error deleting tour:", error);
    setTours(prev => prev.filter(t => t.id !== id));
  };

  const updateSettings = async (newSettings: SiteSettings) => {
    // Assuming settings table has a single row with id = 1
    const { data, error } = await supabase.from('settings').update(convertKeys(newSettings, toSnakeCase)).eq('id', 1).select().single();
     if (error) return console.error("Error updating settings:", error);
     if (data) {
        setSettings(convertKeys(data, toCamelCase) as SiteSettings);
     }
  };

  const addLogEntry = async (logEntry: Omit<LogEntry, 'id'>) => {
    const { data, error } = await supabase.from('log_entries').insert(convertKeys(logEntry, toSnakeCase)).select().single();
     if (error) return console.error("Error adding log entry:", error);
     if(data) {
        setLogEntries(prev => [convertKeys(data, toCamelCase) as LogEntry, ...prev]);
     }
  };

  const value = {
    isAuthenticated,
    isLoading,
    login,
    logout,
    tours,
    inquiries,
    settings,
    logEntries,
    updateInquiryStatus,
    addInquiry,
    updateTour,
    addTour,
    deleteTour,
    updateSettings,
    addLogEntry,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};