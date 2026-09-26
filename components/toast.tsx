"use client";
/** Toast notifications (MUI Snackbar + Alert) */
import { createContext, useCallback, useContext, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const ToastCtx = createContext<{ show: (msg: string, severity?: "success" | "error") => void }>({ show: () => {} });
export const useToast = () => useContext(ToastCtx);

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{ open: boolean; msg: string; sev: "success" | "error" }>({ open: false, msg: "", sev: "success" });
  const show = useCallback((msg: string, severity: "success" | "error" = "success") => setState({ open: true, msg, sev: severity }), []);
  return (
    <ToastCtx.Provider value={{ show }}>
      {children}
      <Snackbar
        open={state.open}
        autoHideDuration={2800}
        onClose={() => setState((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={state.sev} variant="filled" onClose={() => setState((s) => ({ ...s, open: false }))} sx={{ borderRadius: 3, boxShadow: "0 18px 50px rgba(59,36,31,.3)" }}>
          {state.msg}
        </Alert>
      </Snackbar>
    </ToastCtx.Provider>
  );
}
