import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { BottomNav } from "@/components/BottomNav";

export const Route = createFileRoute("/_app")({
  component: AppShell,
});

function AppShell() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const visitante = typeof window !== "undefined" && localStorage.getItem("wcd_visitante") === "1";

  useEffect(() => {
    if (!loading && !user && !visitante) navigate({ to: "/auth", replace: true });
  }, [user, loading, visitante, navigate]);

  if (loading || (!user && !visitante)) {
    return <div className="grid min-h-screen place-items-center text-muted-foreground">Carregando...</div>;
  }
  return (
    <div className="min-h-screen pb-28">
      <Outlet />
      <BottomNav />
    </div>
  );
}
