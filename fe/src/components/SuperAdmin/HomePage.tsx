import { useMemo, useState } from "react";
import { DollarSign, Eye, Wallet2, TrendingUp, Download, MoreHorizontal, ChevronDown, ArrowUpRight, ArrowDownRight } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  RadialBarChart,
  RadialBar,
} from "recharts";
const HomePage=()=>{
    const [range, setRange] = useState<"Day" | "Week" | "Month" | "Year">("Day");

  const kpis = [
    { label: "Total Sales", value: "32,981", cta: "View all sales", iconBg: "bg-violet-100", icon: <Wallet2 className="h-5 w-5 text-violet-600" />, trend: { dir: "up" as const, value: "0.29%" } },
    { label: "Total Revenue", value: "$14,32,145", cta: "complete revenue", iconBg: "bg-orange-100", icon: <DollarSign className="h-5 w-5 text-orange-500" />, trend: { dir: "down" as const, value: "3.45%" } },
    { label: "Page Views", value: "4,678", cta: "Total page views", iconBg: "bg-emerald-100", icon: <Eye className="h-5 w-5 text-emerald-600" />, trend: { dir: "up" as const, value: "11.54%" } },
    { label: "Profit By Sale", value: "$645", cta: "Total profit earned", iconBg: "bg-sky-100", icon: <TrendingUp className="h-5 w-5 text-sky-600" />, trend: { dir: "up" as const, value: "0.18%" } },
  ];

  const orders = useMemo(
    () => [
      { m: "Jan", delivered: 40, pending: 22, cancelled: 12 },
      { m: "Feb", delivered: 55, pending: 18, cancelled: 9 },
      { m: "Mar", delivered: 52, pending: 26, cancelled: 14 },
      { m: "Apr", delivered: 60, pending: 21, cancelled: 11 },
      { m: "May", delivered: 48, pending: 23, cancelled: 8 },
      { m: "Jun", delivered: 58, pending: 20, cancelled: 15 },
      { m: "Jul", delivered: 62, pending: 24, cancelled: 7 },
      { m: "Aug", delivered: 49, pending: 29, cancelled: 10 },
      { m: "Sep", delivered: 57, pending: 19, cancelled: 13 },
      { m: "Oct", delivered: 53, pending: 25, cancelled: 9 },
      { m: "Nov", delivered: 70, pending: 22, cancelled: 21 },
      { m: "Dec", delivered: 65, pending: 18, cancelled: 12 },
    ],
    []
  );

  const visitorsBar = [
    { d: "Mon", thisWeek: 12, lastWeek: 9 },
    { d: "Tue", thisWeek: 18, lastWeek: 14 },
    { d: "Wed", thisWeek: 15, lastWeek: 12 },
    { d: "Thu", thisWeek: 22, lastWeek: 18 },
    { d: "Fri", thisWeek: 16, lastWeek: 15 },
    { d: "Sat", thisWeek: 20, lastWeek: 10 },
    { d: "Sun", thisWeek: 12, lastWeek: 8 },
  ];

  const topSelling = [
    { name: "Electronics", value: 1754, color: "#6d4cff" },
    { name: "Accessories", value: 1234, color: "#ff6b6b" },
    { name: "Home Appliances", value: 878, color: "#10b981" },
    { name: "Beauty Products", value: 270, color: "#06b6d4" },
    { name: "Furniture", value: 456, color: "#f59e0b" },
  ];

  const countries = [
    { name: "United States", emoji: "🇺🇸", sales: 32190, users: 32190, change: "+ 0.27%" },
    { name: "Germany", emoji: "🇩🇪", sales: 29234, users: 8798, change: "+ 0.12%" },
    { name: "Mexico", emoji: "🇲🇽", sales: 26166, users: 16885, change: "- 0.75%" },
    { name: "UAE", emoji: "🇦🇪", sales: 24263, users: 14885, change: "+ 1.45%" },
    { name: "Argentina", emoji: "🇦🇷", sales: 23897, users: 17578, change: "+ 0.36%" },
    { name: "Russia", emoji: "🇷🇺", sales: 20212, users: 10118, change: "- 0.68%" },
  ];

  const gender = [
    { name: "Male", value: 18235, fill: "#6d4cff" },
    { name: "Female", value: 12743, fill: "#f97316" },
    { name: "Others", value: 5369, fill: "#10b981" },
    { name: "Not Mentioned", value: 16458, fill: "#06b6d4" },
  ];

  const activity = [
    { time: "12:45 AM", color: "bg-violet-500", text: "Jane Smith ordered 5 new units of Product Y." },
    { time: "03:26 PM", color: "bg-rose-500", text: "Scheduled demo with potential client DEF for next Tuesday" },
    { time: "08:52 PM", color: "bg-emerald-500", text: "Product X price updated to $XX.XX per every unit" },
    { time: "02:54 AM", color: "bg-sky-500", text: "Database backup completed successfully" },
    { time: "11:38 AM", color: "bg-orange-500", text: "Generated $10,000 in revenue" },
    { time: "01:42 PM", color: "bg-rose-500", text: "Processed refund for Order #13579 due to defective item" },
  ];

  const transactions = [
    { mode: "Paypal ****2783", type: "Online Transaction", amount: "$1,234.78", date: "Nov 22, 2024" },
    { mode: "Digital Wallet", type: "Online Transaction", amount: "$623.99", date: "Nov 22, 2024" },
    { mode: "Mastro Card ****7893", type: "Card Payment", amount: "$1,324", date: "Nov 21, 2024" },
    { mode: "Cash On Delivery", type: "Pay On Delivery", amount: "$1,123.49", date: "Nov 20, 2024" },
    { mode: "Visa Card ****2563", type: "Card Payment", amount: "$1,289", date: "Nov 18, 2024" },
  ];

  return (
    <div className="space-y-6">
      {/* KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-slate-500">{k.label}</div>
                <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-800">{k.value}</div>
                <a href="#" className="mt-3 inline-block text-xs text-slate-500 hover:text-slate-700 underline underline-offset-4">{k.cta}</a>
              </div>
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${k.iconBg}`}>{k.icon}</div>
            </div>
            <div className="mt-3 text-xs flex items-center gap-1">
              {k.trend.dir === "up" ? <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" /> : <ArrowDownRight className="h-3.5 w-3.5 text-rose-500" />}
              <span className={k.trend.dir === "up" ? "text-emerald-600" : "text-rose-600"}>{k.trend.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Visitors Report */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4">
          <div className="flex items-center justify-between pb-2">
            <h3 className="font-semibold text-slate-800">Visitors Report</h3>
            <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal className="h-5 w-5" /></button>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg border border-slate-200 p-3">
              <div className="text-slate-500">This Week</div>
              <div className="mt-1 text-xl font-semibold text-slate-800">14,642</div>
              <div className="text-emerald-600 text-xs">↑ 0.64%</div>
            </div>
            <div className="rounded-lg border border-slate-200 p-3">
              <div className="text-slate-500">Last Week</div>
              <div className="mt-1 text-xl font-semibold text-slate-800">12,326</div>
              <div className="text-rose-600 text-xs">↓ 5.31%</div>
            </div>
          </div>
          <div className="mt-4 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={visitorsBar}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2ff" />
                <XAxis dataKey="d" tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <YAxis hide />
                <Tooltip contentStyle={{ borderRadius: 12 }} />
                <Bar dataKey="thisWeek" radius={[6, 6, 0, 0]} fill="#6d4cff" />
                <Bar dataKey="lastWeek" radius={[6, 6, 0, 0]} fill="#f97316" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Statistics */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4 xl:col-span-2">
          <div className="flex items-center justify-between pb-3">
            <h3 className="font-semibold text-slate-800">Order Statistics</h3>
            <div className="flex items-center gap-2">
              {(["Day", "Week", "Month", "Year"] as const).map((t) => (
                <button key={t} onClick={() => setRange(t)} className={`px-3 py-1.5 rounded-lg text-sm border transition ${range === t ? "bg-violet-600 text-white border-violet-600" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>{t}</button>
              ))}
              <button className="ml-2 inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50">Export <ChevronDown className="h-4 w-4" /></button>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={orders} margin={{ left: 4, right: 4 }}>
                <defs>
                  <linearGradient id="areaViolet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6d4cff" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#6d4cff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2ff" />
                <XAxis dataKey="m" tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 12 }} />
                <Legend verticalAlign="top" height={24} wrapperStyle={{ fontSize: 12, color: "#64748b" }} />
                <Area type="monotone" dataKey="delivered" name="Delivered" stroke="#6d4cff" fill="url(#areaViolet)" strokeWidth={2} />
                <Line type="monotone" dataKey="pending" name="Pending" stroke="#94a3b8" strokeDasharray="6 6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="cancelled" name="Cancelled" stroke="#ef4444" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Selling */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4">
          <div className="flex items-center justify-between pb-2">
            <h3 className="font-semibold text-slate-800">Top Selling categories</h3>
            <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal className="h-5 w-5" /></button>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={topSelling} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={2}>
                  {topSelling.map((e, i) => (<Cell key={i} fill={e.color} />))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 space-y-2 text-sm">
            {topSelling.map((c) => (
              <li key={c.name} className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: c.color }} />{c.name}</span>
                <span className="text-slate-500">{c.value.toLocaleString()} <span className="text-xs">Sales</span></span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Middle: Country sales + Gender + Activity + Transactions */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Country Wise Sales */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4">
          <h3 className="font-semibold text-slate-800 mb-2">Country Wise Sales</h3>
          <ul className="space-y-3">
            {countries.map((c) => (
              <li key={c.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{c.emoji}</span>
                  <div>
                    <div className="font-medium text-slate-700">{c.name}</div>
                    <div className="text-xs text-slate-400">{c.users.toLocaleString()} Sales</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-slate-700">${c.sales.toLocaleString()}</div>
                  <div className={`text-xs ${c.change.startsWith("+") ? "text-emerald-600" : "text-rose-600"}`}>{c.change}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Visitors By Gender */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4">
          <h3 className="font-semibold text-slate-800 mb-2">Visitors By Gender</h3>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart innerRadius="50%" outerRadius="100%" startAngle={180} endAngle={0} data={gender}>
                <RadialBar background dataKey="value" cornerRadius={8} />
                <Legend iconType="circle" verticalAlign="bottom" height={36} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-center text-slate-500 text-sm">Total Visitors <span className="font-semibold text-slate-700">52805</span></div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4">
          <h3 className="font-semibold text-slate-800 mb-2">Recent Activity</h3>
          <ul className="space-y-3 text-sm">
            {activity.map((a, idx) => (
              <li key={idx} className="grid grid-cols-[70px_1fr] items-start gap-3">
                <div className="text-slate-400">{a.time}</div>
                <div className="flex items-start gap-2">
                  <span className={`mt-1 h-2.5 w-2.5 rounded-full ${a.color}`} />
                  <span className="text-slate-700">{a.text}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4 xl:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-slate-800">Recent Transactions</h3>
            <button className="text-xs text-violet-600 hover:text-violet-700">View All →</button>
          </div>
          <ul className="divide-y divide-slate-100">
            {transactions.map((t, i) => (
              <li key={i} className="py-3 flex items-center justify-between text-sm">
                <div>
                  <div className="font-medium text-slate-700">{t.mode}</div>
                  <div className="text-xs text-slate-400">{t.type}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-slate-700">{t.amount}</div>
                  <div className="text-xs text-slate-400">{t.date}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom row: Recent Orders + Visitors By Browser (simple) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <RecentOrdersTable />
        <VisitorsByBrowserCard />
      </div>

      <div className="text-center text-xs text-slate-400">Copyright © 2025 Zynix. Designed with ❤️ All rights reserved</div>
    </div>
  );
}

function RecentOrdersTable() {
  const rows = [
    { p: "Classic tufted leather sofa", c: "Furniture", q: 1, cust: "Lucas Hayes", status: "Shipped", price: "$1200.00", date: "2024-05-18" },
    { p: "Rose Flower Pot", c: "Decoration", q: 2, cust: "Abigail Scott", status: "Delivered", price: "$250.00", date: "2024-05-19" },
    { p: "Leather Handbag", c: "Fashion", q: 1, cust: "Mason Wallace", status: "Processing", price: "$800.00", date: "2024-05-20" },
    { p: "Polaroid Medium Camera", c: "Electronics", q: 3, cust: "Chloe Lewis", status: "Pending", price: "$50.00", date: "2024-05-20" },
    { p: "Digital Watch", c: "Fashion", q: 2, cust: "Henry Morgan", status: "Shipped", price: "$100.00", date: "2024-05-21" },
  ];
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4 xl:col-span-2">
      <div className="flex items-center justify-between pb-3">
        <h3 className="font-semibold text-slate-800">Recent Orders</h3>
        <div className="flex items-center gap-2">
          <input className="hidden md:block px-3 py-2 rounded-lg border border-slate-200 text-sm" placeholder="Search Here" />
          <button className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">Sort By <ChevronDown className="h-4 w-4" /></button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500">
              <th className="py-3 pr-4 font-medium">Product</th>
              <th className="py-3 pr-4 font-medium">Category</th>
              <th className="py-3 pr-4 font-medium">Quantity</th>
              <th className="py-3 pr-4 font-medium">Customer</th>
              <th className="py-3 pr-4 font-medium">Status</th>
              <th className="py-3 pr-4 font-medium">Price</th>
              <th className="py-3 pr-4 font-medium">Ordered Date</th>
              <th className="py-3 pr-4 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((r) => (
              <tr key={r.p} className="text-slate-700">
                <td className="py-3 pr-4">{r.p}</td>
                <td className="py-3 pr-4">{r.c}</td>
                <td className="py-3 pr-4">{r.q}</td>
                <td className="py-3 pr-4">{r.cust}</td>
                <td className="py-3 pr-4">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs ${r.status === "Delivered" ? "bg-emerald-50 text-emerald-700" : r.status === "Pending" ? "bg-amber-50 text-amber-700" : r.status === "Processing" ? "bg-orange-50 text-orange-700" : "bg-violet-50 text-violet-700"}`}>{r.status}</span>
                </td>
                <td className="py-3 pr-4">{r.price}</td>
                <td className="py-3 pr-4">{r.date}</td>
                <td className="py-3 pr-4"><button className="text-violet-600 hover:text-violet-800 text-xs">View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
        <span>Showing 5 Entries</span>
        <div className="inline-flex items-center gap-1">
          <button className="px-2 py-1 rounded-lg border border-slate-200">Prev</button>
          <button className="px-2 py-1 rounded-lg bg-violet-600 text-white">1</button>
          <button className="px-2 py-1 rounded-lg border border-slate-200">2</button>
          <button className="px-2 py-1 rounded-lg border border-slate-200">next</button>
        </div>
      </div>
    </div>
  );
}

function VisitorsByBrowserCard() {
  const browsers = [
    { name: "Chrome", value: 13546, change: "+ 3.26%" },
    { name: "Edge", value: 11322, change: "- 0.96%" },
    { name: "Firefox", value: 6236, change: "+ 1.64%" },
    { name: "Safari", value: 10235, change: "+ 6.38%" },
    { name: "UCBrowser", value: 14965, change: "+ 5.18%" },
    { name: "Opera", value: 8432, change: "- 1.65%" },
    { name: "Samsung Internet", value: 4134, change: "+ 0.99%" },
  ];
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4 xl:col-span-1">
      <div className="flex items-center justify-between pb-3">
        <h3 className="font-semibold text-slate-800">Visitors By Browser</h3>
      </div>
      <ul className="space-y-4">
        {browsers.map((b, i) => (
          <li key={b.name}>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-slate-700">{b.name}</span>
              <span className="text-slate-500">{b.value.toLocaleString()}</span>
            </div>
            <div className="mt-1 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
              <div className="h-2 rounded-full bg-violet-500" style={{ width: `${70 - i * 8}%` }} />
            </div>
            <div className={`mt-1 text-xs ${b.change.startsWith("+") ? "text-emerald-600" : "text-rose-600"}`}>{b.change}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default HomePage;