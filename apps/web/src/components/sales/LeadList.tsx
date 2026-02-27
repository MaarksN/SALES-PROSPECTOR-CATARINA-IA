import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import type { Lead } from "@/types/sales";
import LeadModal from "./LeadModal";
import { Search, Filter, RefreshCw, X, Loader2, Search as SearchX } from "lucide-react";
import { useSalesStore } from "@/store/useSalesStore";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";

import LeadCard from "./LeadCard";

export default function LeadList() {
  const { leads, setLeads, isLoading, setIsLoading } = useSalesStore();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const lastFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedLead) return;

      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedLead]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/sales/leads?take=1000");
      if (!res.ok) throw new Error("Failed to fetch leads");
      const data = await res.json();
      setLeads(data);
    } catch (e) {
      console.error(e);
      if (leads.length === 0) {
        // Optional: fallback to mock data
      }
      toast.error(
        "Erro ao carregar leads. Verifique se o backend está rodando.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCall = useCallback((lead: Lead) => {
    toast.success(`Iniciando chamada com ${lead.name}...`);
    console.log(`Navigating to call: /dashboard/call/new?leadId=${lead.id}`);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedLead(null);
    setTimeout(() => {
      lastFocusedElement.current?.focus();
    }, 0);
  }, []);

  // Removed unused handleClearSearch to fix TS6133
  // Removed unused searchableLeads to fix TS6133

  const filteredLeads = useMemo(() => {
    const lowerSearch = debouncedSearch.toLowerCase();
    return leads.filter(
      (l) =>
        l.name.toLowerCase().includes(lowerSearch) ||
        l.company.toLowerCase().includes(lowerSearch),
    );
  }, [leads, debouncedSearch]); // Fixed dependency array

  return (
    <div className="animate-in fade-in duration-500 p-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">Meus Leads</h1>
          <p className="text-slate-500">
            Gerencie suas oportunidades de prospecção.
          </p>
        </div>
        <div className="flex gap-2">
            <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                    ref={inputRef}
                    type="search"
                    aria-label="Buscar leads"
                    placeholder="Buscar por nome ou empresa..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-10 rounded-lg border bg-white pl-9 pr-8 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white w-64 [&::-webkit-search-cancel-button]:hidden"
                />
                {search && (
                    <button
                        onClick={() => setSearch("")}
                        className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none focus:text-indigo-500"
                        aria-label="Limpar busca"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>
            <Button
                variant="outline"
                size="icon"
                onClick={fetchLeads}
                disabled={isLoading}
                aria-label="Atualizar lista de leads"
                title="Atualizar lista"
            >
                <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
            </Button>
            <Button
                variant="outline"
                size="icon"
                aria-label="Filtrar leads"
                title="Filtrar"
            >
                <Filter size={18} />
            </Button>
        </div>
      </div>

      {isLoading && leads.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-3">
          <Loader2 className="animate-spin text-indigo-500" size={32} />
          <p>Carregando leads...</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredLeads.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onClick={setSelectedLead}
              onCall={handleCall}
            />
          ))}
          {filteredLeads.length === 0 && !isLoading && (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-slate-500">
              <SearchX size={48} className="mb-4 text-slate-300" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Nenhum lead encontrado
              </h3>
              <p className="text-sm text-slate-400">
                Tente buscar por outro termo ou limpe os filtros.
              </p>
            </div>
          )}
        </div>
      )}

      {selectedLead && (
        <LeadModal
            lead={selectedLead}
            onClose={handleCloseModal}
            onCall={handleCall}
        />
      )}
    </div>
  );
}
