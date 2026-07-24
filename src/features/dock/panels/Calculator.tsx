import { useState } from "react";
import { Button } from "@/components/ui/button";

const KEYS = [
  ["C", "±", "%", "÷"],
  ["7", "8", "9", "×"],
  ["4", "5", "6", "−"],
  ["1", "2", "3", "+"],
  ["0", ".", "="],
];

function evalExpr(expr: string): string {
  try {
    // eslint-disable-next-line no-new-func
    const r = new Function("return (" + expr.replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-") + ")")();
    return String(Number.isFinite(r) ? r : "Err");
  } catch {
    return "Err";
  }
}

export default function CalculatorPanel() {
  const [expr, setExpr] = useState("");
  const [result, setResult] = useState("0");

  const press = (k: string) => {
    if (k === "C") {
      setExpr("");
      setResult("0");
      return;
    }
    if (k === "=") {
      const r = evalExpr(expr);
      setResult(r);
      setExpr(r === "Err" ? "" : r);
      return;
    }
    if (k === "±") {
      setExpr((e) => (e.startsWith("-") ? e.slice(1) : "-" + e));
      return;
    }
    if (k === "%") {
      const r = evalExpr(expr);
      const n = Number(r) / 100;
      setExpr(String(n));
      setResult(String(n));
      return;
    }
    setExpr((e) => e + k);
  };

  return (
    <div className="flex flex-col h-full">
      <h3 className="font-semibold mb-3">Calculator</h3>
      <div className="rounded-xl bg-[var(--apt-tile)] p-3 mb-3 text-right">
        <div className="text-xs text-muted-foreground min-h-4 truncate">{expr || "\u00A0"}</div>
        <div className="text-2xl font-mono">{result}</div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {KEYS.flat().map((k) => (
          <Button
            key={k}
            variant={["÷", "×", "−", "+", "="].includes(k) ? "default" : "secondary"}
            className={k === "0" ? "col-span-2" : ""}
            onClick={() => press(k)}
          >
            {k}
          </Button>
        ))}
      </div>
    </div>
  );
}