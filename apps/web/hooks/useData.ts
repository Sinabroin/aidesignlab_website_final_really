/** API 데이터 페칭 훅 — generic useApi로 보일러플레이트 제거 */
import { useState, useEffect } from "react";
import * as api from "@/lib/data/fetch";

type Status = "idle" | "loading" | "success" | "error";

function useApi<T>(fetcher: () => Promise<T>, initial: T, deps: unknown[] = []) {
  const [data, setData] = useState<T>(initial);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setStatus("loading");
    setError(null);
    // #region agent log
    const t0 = Date.now();
    // #endregion
    fetcher()
      .then((result) => {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/a0870979-13d6-454e-aa79-007419c9500b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useData.ts:useApi',message:'fetch success',data:{elapsed:Date.now()-t0,dataSize:JSON.stringify(result).length},timestamp:Date.now(),hypothesisId:'H3'})}).catch(()=>{});
        // #endregion
        setData(result);
        setStatus("success");
      })
      .catch((e) => {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/a0870979-13d6-454e-aa79-007419c9500b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useData.ts:useApi',message:'fetch error',data:{elapsed:Date.now()-t0,error:String(e)},timestamp:Date.now(),hypothesisId:'H3'})}).catch(()=>{});
        // #endregion
        setError(e instanceof Error ? e.message : "Failed to load");
        setStatus("error");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, status, error, isLoading: status === "loading" };
}

export function usePlaybook(category: string) {
  return useApi(() => api.fetchPlaybook(category), [], [category]);
}

export function usePlayday() {
  return useApi(() => api.fetchPlayday(), []);
}

export function useNotices() {
  return useApi(() => api.fetchNotices(), []);
}

export function useSchedules() {
  return useApi(() => api.fetchSchedules(), []);
}

export function useQuickLinks() {
  return useApi(() => api.fetchQuickLinks(), []);
}

export function useActivity() {
  return useApi(() => api.fetchActivity(), []);
}

export function useMarquee() {
  const result = useApi(() => api.fetchMarquee(), null);
  return {
    ...result,
    topRow: result.data?.topRow ?? [],
    bottomRow: result.data?.bottomRow ?? [],
  };
}

export function useAdminContent() {
  return useApi(() => api.fetchAdminContent(), []);
}

export function useHomeContent() {
  const result = useApi(() => api.fetchHomeContent(), null);
  return {
    ...result,
    banners: result.data?.banners ?? [],
    notices: result.data?.notices ?? [],
    playdayGuides: result.data?.playdayGuides ?? [],
  };
}
