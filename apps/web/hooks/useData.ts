/**
 * API 데이터 페칭 훅
 */
import { useState, useEffect } from "react";
import * as api from "@/lib/data/fetch";

type Status = "idle" | "loading" | "success" | "error";

export function usePlaybook(category: string) {
  const [data, setData] = useState<Awaited<ReturnType<typeof api.fetchPlaybook>>>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setStatus("loading");
    setError(null);
    api
      .fetchPlaybook(category)
      .then(setData)
      .then(() => setStatus("success"))
      .catch((e) => {
        setError(e instanceof Error ? e.message : "Failed to load");
        setStatus("error");
      });
  }, [category]);

  return { data, status, error, isLoading: status === "loading" };
}

export function usePlayday() {
  const [data, setData] = useState<Awaited<ReturnType<typeof api.fetchPlayday>>>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setStatus("loading");
    setError(null);
    api
      .fetchPlayday()
      .then(setData)
      .then(() => setStatus("success"))
      .catch((e) => {
        setError(e instanceof Error ? e.message : "Failed to load");
        setStatus("error");
      });
  }, []);

  return { data, status, error, isLoading: status === "loading" };
}

export function useNotices() {
  const [data, setData] = useState<Awaited<ReturnType<typeof api.fetchNotices>>>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setStatus("loading");
    setError(null);
    api
      .fetchNotices()
      .then(setData)
      .then(() => setStatus("success"))
      .catch((e) => {
        setError(e instanceof Error ? e.message : "Failed to load");
        setStatus("error");
      });
  }, []);

  return { data, status, error, isLoading: status === "loading" };
}

export function useSchedules() {
  const [data, setData] = useState<Awaited<ReturnType<typeof api.fetchSchedules>>>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setStatus("loading");
    setError(null);
    api
      .fetchSchedules()
      .then(setData)
      .then(() => setStatus("success"))
      .catch((e) => {
        setError(e instanceof Error ? e.message : "Failed to load");
        setStatus("error");
      });
  }, []);

  return { data, status, error, isLoading: status === "loading" };
}

export function useQuickLinks() {
  const [data, setData] = useState<Awaited<ReturnType<typeof api.fetchQuickLinks>>>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setStatus("loading");
    setError(null);
    api
      .fetchQuickLinks()
      .then(setData)
      .then(() => setStatus("success"))
      .catch((e) => {
        setError(e instanceof Error ? e.message : "Failed to load");
        setStatus("error");
      });
  }, []);

  return { data, status, error, isLoading: status === "loading" };
}

export function useActivity() {
  const [data, setData] = useState<Awaited<ReturnType<typeof api.fetchActivity>>>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setStatus("loading");
    setError(null);
    api
      .fetchActivity()
      .then(setData)
      .then(() => setStatus("success"))
      .catch((e) => {
        setError(e instanceof Error ? e.message : "Failed to load");
        setStatus("error");
      });
  }, []);

  return { data, status, error, isLoading: status === "loading" };
}

export function useMarquee() {
  const [data, setData] = useState<Awaited<ReturnType<typeof api.fetchMarquee>> | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setStatus("loading");
    setError(null);
    api
      .fetchMarquee()
      .then(setData)
      .then(() => setStatus("success"))
      .catch((e) => {
        setError(e instanceof Error ? e.message : "Failed to load");
        setStatus("error");
      });
  }, []);

  return {
    data,
    status,
    error,
    isLoading: status === "loading",
    topRow: data?.topRow ?? [],
    bottomRow: data?.bottomRow ?? [],
  };
}

export function useAdminContent() {
  const [data, setData] = useState<
    Awaited<ReturnType<typeof api.fetchAdminContent>>
  >([]);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setStatus("loading");
    setError(null);
    api
      .fetchAdminContent()
      .then(setData)
      .then(() => setStatus("success"))
      .catch((e) => {
        setError(e instanceof Error ? e.message : "Failed to load");
        setStatus("error");
      });
  }, []);

  return { data, status, error, isLoading: status === "loading" };
}
