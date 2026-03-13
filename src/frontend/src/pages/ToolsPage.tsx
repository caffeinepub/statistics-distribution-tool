import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BarChart3, Calculator, ChevronRight, Search } from "lucide-react";
import { useMemo, useState } from "react";
import DistributionCharts from "../components/DistributionCharts";
import {
  type ChartPoint,
  DISTRIBUTIONS,
  type Distribution,
  type PPPoint,
  type QQPoint,
  type StatResults,
  computeDistribution,
} from "../utils/distributions";

type ComputeResult = {
  stats: StatResults;
  chartData: ChartPoint[];
  ppData: PPPoint[];
  qqData: QQPoint[];
};

function formatStat(v: number | string | undefined): string {
  if (v === undefined || v === null) return "—";
  if (typeof v === "string") return v;
  if (!Number.isFinite(v)) return "Undefined";
  if (Math.abs(v) < 0.0001 && v !== 0) return v.toExponential(4);
  return v.toFixed(6);
}

export default function ToolsPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Distribution | null>(null);
  const [paramValues, setParamValues] = useState<Record<string, number>>({});
  const [result, setResult] = useState<ComputeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      DISTRIBUTIONS.filter((d) =>
        d.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
  );

  function selectDistribution(dist: Distribution) {
    setSelected(dist);
    setResult(null);
    setError(null);
    const defaults: Record<string, number> = {};
    for (const p of dist.params) {
      defaults[p.name] = p.defaultValue;
    }
    setParamValues(defaults);
  }

  function handleCompute() {
    if (!selected) return;
    try {
      const computed = computeDistribution(selected.id, paramValues);
      setResult(computed);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Computation error");
      setResult(null);
    }
  }

  const statRows: { label: string; key: keyof StatResults }[] = [
    { label: "Mean", key: "mean" },
    { label: "Median", key: "median" },
    { label: "Mode", key: "mode" },
    { label: "Variance", key: "variance" },
    { label: "Skewness", key: "skewness" },
    { label: "Kurtosis (excess)", key: "kurtosis" },
    { label: "Probability Difference", key: "probabilityDifference" },
    { label: "Q1 (25th percentile)", key: "q1" },
    { label: "Q2 / Median (50th)", key: "q2" },
    { label: "Q3 (75th percentile)", key: "q3" },
    { label: "Q4 (upper bound)", key: "q4" },
    { label: "MGF", key: "mgf" },
    { label: "Moment Line Function", key: "momentLine" },
  ];

  return (
    <main className="min-h-screen pink-gradient">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-sans font-medium mb-4">
            <Calculator size={14} />
            Statistical Distribution Tools
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-gradient-pink mb-3">
            Distribution Analysis
          </h1>
          <p className="text-muted-foreground font-sans text-base max-w-2xl mx-auto">
            Select a probability distribution, input parameters, and instantly
            compute precise statistical measures with interactive
            visualisations.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-xl mx-auto mb-8">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={16}
          />
          <Input
            data-ocid="tools.search_input"
            placeholder="Search distributions…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card border-border shadow-pink"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Distribution Cards */}
          <div className="lg:col-span-1 space-y-3">
            <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <BarChart3 size={18} className="text-primary" />
              Distributions
            </h2>
            {filtered.length === 0 && (
              <div
                data-ocid="distribution.empty_state"
                className="text-center py-10 text-muted-foreground text-sm"
              >
                No distributions match your search.
              </div>
            )}
            {filtered.map((dist, idx) => (
              <button
                key={dist.id}
                type="button"
                data-ocid={`distribution.item.${idx + 1}`}
                onClick={() => selectDistribution(dist)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 group ${
                  selected?.id === dist.id
                    ? "border-primary bg-primary/5 shadow-pink"
                    : "border-border bg-card hover:border-primary/40 hover:shadow-pink"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-sans font-semibold text-sm text-foreground">
                      {dist.shortName}
                    </p>
                    <p className="font-sans text-xs text-muted-foreground mt-0.5 leading-snug">
                      {dist.name}
                    </p>
                  </div>
                  <ChevronRight
                    size={16}
                    className={`text-muted-foreground transition-transform ${
                      selected?.id === dist.id
                        ? "text-primary rotate-90"
                        : "group-hover:translate-x-0.5"
                    }`}
                  />
                </div>
                <div className="flex gap-1 mt-2">
                  {dist.params.map((p) => (
                    <Badge
                      key={p.name}
                      variant="secondary"
                      className="text-xs font-mono px-1.5 py-0"
                    >
                      {p.symbol}
                    </Badge>
                  ))}
                </div>
              </button>
            ))}
          </div>

          {/* Parameters + Results */}
          <div className="lg:col-span-2 space-y-6">
            {!selected ? (
              <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border rounded-2xl bg-card/60 text-center">
                <Calculator size={40} className="text-primary/30 mb-3" />
                <p className="font-sans text-muted-foreground text-sm">
                  Select a distribution from the left to begin analysis
                </p>
              </div>
            ) : (
              <>
                {/* Parameter Form */}
                <Card className="border-border shadow-pink">
                  <CardHeader className="pb-3">
                    <CardTitle className="font-display text-lg">
                      {selected.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                      {selected.params.map((p) => (
                        <div key={p.name}>
                          <Label className="font-sans text-xs text-muted-foreground mb-1 block">
                            {p.label}
                          </Label>
                          <Input
                            type="number"
                            min={p.min}
                            step={p.step}
                            value={paramValues[p.name] ?? p.defaultValue}
                            onChange={(e) =>
                              setParamValues((prev) => ({
                                ...prev,
                                [p.name]: Number.parseFloat(e.target.value),
                              }))
                            }
                            className="font-mono text-sm h-9"
                          />
                        </div>
                      ))}
                    </div>
                    <Button
                      data-ocid="params.submit_button"
                      onClick={handleCompute}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-pink transition-all"
                    >
                      Compute Statistics
                    </Button>
                    {error && (
                      <p
                        data-ocid="params.error_state"
                        className="text-destructive text-sm mt-2 font-sans"
                      >
                        {error}
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Results */}
                {result && (
                  <div className="space-y-6 animate-fade-in">
                    {/* Stats Table */}
                    <Card className="border-border">
                      <CardHeader className="pb-3">
                        <CardTitle className="font-display text-lg">
                          Statistical Measures
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <Table data-ocid="stats.table">
                          <TableHeader>
                            <TableRow className="bg-secondary/60">
                              <TableHead className="font-sans font-semibold text-xs text-foreground pl-4">
                                Measure
                              </TableHead>
                              <TableHead className="font-sans font-semibold text-xs text-foreground font-mono">
                                Value
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {statRows.map(({ label, key }, i) => (
                              <TableRow
                                key={key}
                                className={
                                  i % 2 === 0
                                    ? "bg-background"
                                    : "bg-secondary/30"
                                }
                              >
                                <TableCell className="font-sans text-sm font-medium pl-4 py-2.5">
                                  {label}
                                </TableCell>
                                <TableCell className="font-mono text-sm text-primary py-2.5 break-words max-w-xs">
                                  {formatStat(
                                    result.stats[key] as number | string,
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>

                    {/* Charts */}
                    <Card className="border-border">
                      <CardHeader className="pb-3">
                        <CardTitle className="font-display text-lg">
                          Interactive Charts
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <DistributionCharts
                          chartData={result.chartData}
                          ppData={result.ppData}
                          qqData={result.qqData}
                        />
                      </CardContent>
                    </Card>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
