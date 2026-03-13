import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ChartPoint, PPPoint, QQPoint } from "../utils/distributions";

interface Props {
  chartData: ChartPoint[];
  ppData: PPPoint[];
  qqData: QQPoint[];
}

const PINK = "oklch(0.55 0.18 350)";
const PINK2 = "oklch(0.65 0.14 330)";
const PINK3 = "oklch(0.45 0.15 350)";

function fmt(v: number): string {
  if (Math.abs(v) < 0.001 && v !== 0) return v.toExponential(3);
  return v.toFixed(4);
}

export default function DistributionCharts({
  chartData,
  ppData,
  qqData,
}: Props) {
  const diagonalData = [
    { x: 0, y: 0 },
    { x: 1, y: 1 },
  ];
  void diagonalData;

  return (
    <div className="animate-fade-in">
      <Tabs defaultValue="pdf">
        <TabsList className="flex flex-wrap gap-1 h-auto p-1 mb-4 bg-secondary">
          <TabsTrigger
            value="pdf"
            data-ocid="chart.tab.1"
            className="text-xs sm:text-sm"
          >
            PDF
          </TabsTrigger>
          <TabsTrigger
            value="cdf"
            data-ocid="chart.tab.2"
            className="text-xs sm:text-sm"
          >
            CDF
          </TabsTrigger>
          <TabsTrigger
            value="sf"
            data-ocid="chart.tab.3"
            className="text-xs sm:text-sm"
          >
            Survival
          </TabsTrigger>
          <TabsTrigger
            value="hf"
            data-ocid="chart.tab.4"
            className="text-xs sm:text-sm"
          >
            Hazard
          </TabsTrigger>
          <TabsTrigger
            value="pp"
            data-ocid="chart.tab.5"
            className="text-xs sm:text-sm"
          >
            PP Plot
          </TabsTrigger>
          <TabsTrigger
            value="qq"
            data-ocid="chart.tab.6"
            className="text-xs sm:text-sm"
          >
            QQ Plot
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pdf">
          <ChartWrapper title="Probability Density Function (PDF)">
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.90 0.03 345)"
              />
              <XAxis
                dataKey="x"
                tickFormatter={fmt}
                label={{
                  value: "x",
                  position: "insideBottomRight",
                  offset: -5,
                }}
              />
              <YAxis
                tickFormatter={fmt}
                label={{ value: "f(x)", angle: -90, position: "insideLeft" }}
              />
              <Tooltip
                formatter={(v: number) => fmt(v)}
                labelFormatter={(l: number) => `x = ${fmt(l)}`}
              />
              <Line
                type="monotone"
                dataKey="pdf"
                stroke={PINK}
                dot={false}
                strokeWidth={2}
                name="f(x)"
              />
            </LineChart>
          </ChartWrapper>
        </TabsContent>

        <TabsContent value="cdf">
          <ChartWrapper title="Cumulative Distribution Function (CDF)">
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.90 0.03 345)"
              />
              <XAxis
                dataKey="x"
                tickFormatter={fmt}
                label={{
                  value: "x",
                  position: "insideBottomRight",
                  offset: -5,
                }}
              />
              <YAxis
                domain={[0, 1]}
                tickFormatter={fmt}
                label={{ value: "F(x)", angle: -90, position: "insideLeft" }}
              />
              <Tooltip
                formatter={(v: number) => fmt(v)}
                labelFormatter={(l: number) => `x = ${fmt(l)}`}
              />
              <Line
                type="monotone"
                dataKey="cdf"
                stroke={PINK2}
                dot={false}
                strokeWidth={2}
                name="F(x)"
              />
            </LineChart>
          </ChartWrapper>
        </TabsContent>

        <TabsContent value="sf">
          <ChartWrapper title="Survival Function S(x) = 1 − F(x)">
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.90 0.03 345)"
              />
              <XAxis
                dataKey="x"
                tickFormatter={fmt}
                label={{
                  value: "x",
                  position: "insideBottomRight",
                  offset: -5,
                }}
              />
              <YAxis
                domain={[0, 1]}
                tickFormatter={fmt}
                label={{ value: "S(x)", angle: -90, position: "insideLeft" }}
              />
              <Tooltip
                formatter={(v: number) => fmt(v)}
                labelFormatter={(l: number) => `x = ${fmt(l)}`}
              />
              <Line
                type="monotone"
                dataKey="sf"
                stroke={PINK3}
                dot={false}
                strokeWidth={2}
                name="S(x)"
              />
            </LineChart>
          </ChartWrapper>
        </TabsContent>

        <TabsContent value="hf">
          <ChartWrapper title="Hazard Function h(x) = f(x) / S(x)">
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.90 0.03 345)"
              />
              <XAxis
                dataKey="x"
                tickFormatter={fmt}
                label={{
                  value: "x",
                  position: "insideBottomRight",
                  offset: -5,
                }}
              />
              <YAxis
                tickFormatter={fmt}
                label={{ value: "h(x)", angle: -90, position: "insideLeft" }}
              />
              <Tooltip
                formatter={(v: number) => fmt(v)}
                labelFormatter={(l: number) => `x = ${fmt(l)}`}
              />
              <Line
                type="monotone"
                dataKey="hf"
                stroke="oklch(0.60 0.20 15)"
                dot={false}
                strokeWidth={2}
                name="h(x)"
              />
            </LineChart>
          </ChartWrapper>
        </TabsContent>

        <TabsContent value="pp">
          <ChartWrapper title="Probability-Probability (PP) Plot">
            <LineChart data={ppData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.90 0.03 345)"
              />
              <XAxis
                dataKey="theoretical"
                domain={[0, 1]}
                tickFormatter={fmt}
                label={{
                  value: "Theoretical CDF",
                  position: "insideBottomRight",
                  offset: -5,
                }}
              />
              <YAxis
                domain={[0, 1]}
                tickFormatter={fmt}
                label={{
                  value: "Empirical CDF",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip formatter={(v: number) => fmt(v)} />
              <ReferenceLine
                segment={[
                  { x: 0, y: 0 },
                  { x: 1, y: 1 },
                ]}
                stroke="oklch(0.72 0.12 310)"
                strokeDasharray="4 4"
              />
              <Line
                type="linear"
                dataKey="empirical"
                stroke={PINK}
                dot={{ r: 2 }}
                strokeWidth={1.5}
                name="Empirical"
              />
            </LineChart>
          </ChartWrapper>
        </TabsContent>

        <TabsContent value="qq">
          <ChartWrapper title="Quantile-Quantile (QQ) Plot">
            <LineChart data={qqData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.90 0.03 345)"
              />
              <XAxis
                dataKey="theoretical"
                tickFormatter={fmt}
                label={{
                  value: "Theoretical Quantile",
                  position: "insideBottomRight",
                  offset: -5,
                }}
              />
              <YAxis
                tickFormatter={fmt}
                label={{
                  value: "Empirical Quantile",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip formatter={(v: number) => fmt(v)} />
              <Line
                type="linear"
                dataKey="empirical"
                stroke={PINK}
                dot={{ r: 2 }}
                strokeWidth={1.5}
                name="Empirical"
              />
            </LineChart>
          </ChartWrapper>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ChartWrapper({
  title,
  children,
}: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-4 bg-card rounded-xl border border-border">
      <h4 className="text-sm font-semibold text-muted-foreground mb-3 font-sans">
        {title}
      </h4>
      <ResponsiveContainer width="100%" height={280}>
        {children as React.ReactElement}
      </ResponsiveContainer>
    </div>
  );
}
