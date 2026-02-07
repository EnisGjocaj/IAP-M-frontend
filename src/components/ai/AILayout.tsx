import React from "react";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { AISidebar } from "./AISidebar";
import { AIHeader } from "./AIHeader";
import { SidebarProvider, SidebarInset } from "../../components/ui/sidebar";
import { getAiStatus } from "../../api/ai";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";

export const AILayout: React.FC = () => {
  const navigate = useNavigate();
  const [aiEnabled, setAiEnabled] = React.useState<boolean>(true);
  const [checked, setChecked] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);

  React.useEffect(() => {
    const load = async () => {
      try {
        const data = (await getAiStatus()) as any;
        setAiEnabled(Boolean(data?.aiEnabled ?? true));
      } catch (err: any) {
        const status = err?.response?.status;
        const message = err?.response?.data?.message;
        const uiMessage = err?.response?.data?.uiMessage;

        if (status === 403 && (message === 'AI_DISABLED' || typeof uiMessage === 'string')) {
          setAiEnabled(false);
        } else {
          setAiEnabled(true);
        }
      } finally {
        setChecked(true);
      }
    };

    load();
  }, []);

  React.useEffect(() => {
    if (checked && !aiEnabled) {
      setModalOpen(true);
    }
  }, [aiEnabled, checked]);

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "16rem",       
        "--sidebar-width-icon": "4rem", 
      } as React.CSSProperties}
    >
      <div className="min-h-screen flex w-full bg-background">
        <div className={checked && !aiEnabled && modalOpen ? "pointer-events-none select-none opacity-60" : undefined}>
          <AISidebar />
        </div>
        <SidebarInset className="flex-1 flex flex-col">
          <div className={checked && !aiEnabled && modalOpen ? "pointer-events-none select-none opacity-60" : undefined}>
            <AIHeader />
          </div>
          <main className="flex-1 p-6 overflow-auto scrollbar-thin">
            {checked && aiEnabled ? (
              <Outlet />
            ) : checked ? (
              <div className={modalOpen ? "pointer-events-none select-none" : undefined}>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-xl border bg-card p-5 shadow-sm">
                    <div className="h-4 w-32 rounded bg-muted/70 animate-pulse" />
                    <div className="mt-4 h-9 w-24 rounded bg-muted/70 animate-pulse" />
                    <div className="mt-3 h-3 w-40 rounded bg-muted/60 animate-pulse" />
                  </div>
                  <div className="rounded-xl border bg-card p-5 shadow-sm">
                    <div className="h-4 w-28 rounded bg-muted/70 animate-pulse" />
                    <div className="mt-4 h-9 w-20 rounded bg-muted/70 animate-pulse" />
                    <div className="mt-3 h-3 w-44 rounded bg-muted/60 animate-pulse" />
                  </div>
                  <div className="rounded-xl border bg-card p-5 shadow-sm">
                    <div className="h-4 w-36 rounded bg-muted/70 animate-pulse" />
                    <div className="mt-4 h-9 w-28 rounded bg-muted/70 animate-pulse" />
                    <div className="mt-3 h-3 w-36 rounded bg-muted/60 animate-pulse" />
                  </div>
                </div>

                <div className="mt-6 rounded-xl border bg-card p-5 shadow-sm">
                  <div className="h-4 w-40 rounded bg-muted/70 animate-pulse" />
                  <div className="mt-4 grid gap-3">
                    <div className="h-10 w-full rounded bg-muted/60 animate-pulse" />
                    <div className="h-10 w-full rounded bg-muted/60 animate-pulse" />
                    <div className="h-10 w-full rounded bg-muted/60 animate-pulse" />
                  </div>
                </div>

                {!modalOpen ? (
                  <div className="mt-6 flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                      onClick={() => navigate('/')}
                    >
                      Kthehu në Kryefaqe
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
                      onClick={() => navigate(-1)}
                    >
                      Kthehu mbrapa
                    </button>
                  </div>
                ) : null}
              </div>
            ) : null}
          </main>
        </SidebarInset>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200 sm:max-w-lg">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary" />
          <DialogHeader className="pt-2">
            <DialogTitle className="text-xl">Shërbimi AI</DialogTitle>
            <DialogDescription className="text-sm leading-relaxed">
              Shërbimi AI është përkohësisht i çaktivizuar dhe do të rikthehet shumë shpejt.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-5 rounded-lg border bg-muted/30 p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full border-4 border-muted border-t-primary animate-spin" />
              <div className="flex-1">
                <div className="text-sm font-medium">Po punojmë për rikthimin e shërbimit</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  Ju mund të vazhdoni të përdorni pjesët e tjera të platformës normalisht.
                </div>
              </div>
            </div>

            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-primary/70 via-secondary/70 to-primary/70 animate-pulse" />
            </div>
          </div>

          <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
              onClick={() => setModalOpen(false)}
            >
              Mbyll
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              onClick={() => navigate('/')}
            >
              Kthehu në Kryefaqe
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

